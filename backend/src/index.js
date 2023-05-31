function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

async function getGameInfo(gameId) {

  const game = await client.game.findUnique({
    where: {
      name: gameId,
    },
    include: {
      Players: {
        include: {
          player: {
            select: {
              name: true,
            }
          },
        }
      },
      course: true,
    }
  });

  return game;
}

const PORT = 3000;

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client');
const cors = require('cors');
const { WebSocket } = require("ws");
const http = require("http");


const client = new PrismaClient();
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
 
app.use(cors())
app.use(express.json())

let allWsConns = []; // websocket tmp storage


// update message format
wss.on('connection', async (ws, req) => {
  const currentGameID = String(req.url).substring(6);
  console.log("Websocket GameID:", currentGameID);

  if (!currentGameID || currentGameID == undefined) {
    console.log("Cant deal with this conn because it's missing an ID");
    return;
  }

  const customWSObj = {
    gameID: currentGameID,
    ws
  };

  //connection is up, let's add a simple simple event
  allWsConns.push(customWSObj);

  // send latest state of game to client
  const game = await client.game.findUnique({
    where: {
      name: currentGameID
    }
  });

  if (!game) {
    console.log("Kein Game gefunden");
    return;
  }

  ws.send(JSON.stringify(game));

  ws.on('message', async (rawData) => {
      const data = JSON.parse(rawData);
      //log the received message and send it back to the client
      console.log('received: %s', data);

      // save updated state of score to db
      const score = data.score;

      if (score == undefined) {
        return conn.send("Missing score object");
      }

      const updatedGame = await client.game.update({
        where: {
          name: currentGameID
        },
        data: {
          scores: score,
        }
      });

      // loop through all potential communication partners
      // drop the ones that dont want to listen:
      for (let i = 0; i < allWsConns.length; i++){
        const conn = allWsConns[i].ws; // for readability

        if (conn.readyState === WebSocket.OPEN) {

          if (allWsConns[i].gameID == currentGameID) {
            // save info to db and send answer to client
            return conn.send(JSON.stringify(updatedGame));
          }
        }
        else {
          // drop it like it's hot
          allWsConns.splice(i, 1);
        }
      }
      
  });
});

app.get('/api/game/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const game = await getGameInfo(gameId);
  res.json(game);
});

app.post(`/api/signup`, async (req, res) => {
  const { name, email } = req.body

  console.log("The User with the Name: " + name + " wants to create a new account!");

  // error handling...
  try {
    const result = await client.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    console.log("Successfully created a new account");

    res.json(result)
  } catch (e) {
    console.log("Could not create new user..");
    // we check whether it is a known error. 
    // see: https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.json({ success: 0, message: 'There was an issue with: "' + e.meta.target + '"' });
    }
    else {
      res.json({ success: 0, message: 'Unknown error occured' });
    }
  }
});

// app.ws('/api/game/:gameId', async(req, res) => {
//   console.log("eehh");
//   ws.on('message', function(msg) {
//     console.log(msg)
//     ws.send(msg);
//   });
//   // const { gameId } = req.params;
//   // const game = await getGameInfo(gameId);
//   // res.json(game);
// });

app.post('/api/course', async (req, res) => {
  const { name, holes } = req.body;

  try {
    const course = await client.course.create({
      data: {
        name,
        holes
      }
    });

    res.json(course);
  }
  catch (e) {
    console.log(e);
    res.json({ success: 0 })
  }
});

//start a new game.. 
app.post('/api/game', async (req, res) => {
  const { users, course } = req.body;

  const newCourse = await client.course.create({
    data: {
      name: course.name,
      holes: parseInt(course.holes),
    }
  });

  const randomId = makeid(6);

  console.log("Creating new game with ID: " + randomId);

  // create the scores...
  let startScore = [];
  let scoreCount = 0;

  while (scoreCount < parseInt(course.holes)) {
    // für jeden spieler score (per default) auf 0 setzen
    let scoresForCurrentHole = [];

    // bit of weird naming going on here
    users.forEach(player => {
      scoresForCurrentHole.push({ score: 0, player: player, row: scoreCount });
    });
    startScore.push(scoresForCurrentHole);
    scoreCount++;
  }

  const newGame = await client.game.create({
    data: {
      name: randomId,
      courseId: newCourse.id,
      scores: startScore,
    },
  });

  const userData = users
    ? users.map((user) => {
      return { name: user.name || undefined }
    })
    : []

  try {
    // create an account for every user that is not yet on the platform.
    for (let user of userData) {
      console.log("Checking existance of user with name: " + user.name);
      let userResult = await client.user.findUnique({
        where: {
          name: user.name
        },
      });

      let playerId = 0;

      if (userResult === null) {
        //if user does not exist...
        console.log("Creating new user...");
        let newUser = await client.user.create({
          data: {
            name: user.name,
          }
        });

        console.log(newUser);

        playerId = newUser.id;
      }
      else {
        console.log("User already existed.");

        playerId = userResult.id;
      }

      // add user to game
      await client.userGames.create({
        data: {
          playerId: playerId,
          gameId: newGame.id
        }
      });
    }
  }
  catch (e) {
    res.json(e);
  }
  let game = await getGameInfo(newGame.name);
  res.json(game);
});

app.put('/api/game/:gameId/score', async (req, res) => {
  const { gameId } = req.params;
  console.log("Updating GameScore for GameID: " + gameId);
  const score = req.body;

  const updatedGame = await client.game.update({
    where: {
      name: gameId
    },
    data: {
      scores: score,
    }
  });

  res.json(updatedGame);
});

app.get('/api/courses', async (req, res) => {
  const courses = await client.course.findMany();
  res.json(courses);
});

app.get('/api/users', async (req, res) => {
  const users = await client.user.findMany();
  res.json(users);
});

server.listen(process.env.PORT || PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)