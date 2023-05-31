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

const PORT = process.env.PORT || 3000;

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client');
const cors = require('cors');
const { WebSocket } = require("ws");
const http = require("http");
const https = require("https");
const fs = require('fs');

const client = new PrismaClient();
const app = express();

let server;
// depending on ssl situation, host accordingly
if (process.env.CERT_FILE && process.env.PEM_FILE) {
  try {
    server = https.createServer({
      key: fs.readFileSync(process.env.KEY_FILE),
      cert: fs.readFileSync(process.env.CERT_FILE)
    }, app);
  }
  catch(e) {
    console.log(e);
    console.log("SSL tried but did not work... trying to start http server");
    server = http.createServer(app);
  }
}
else {
  server = http.createServer(app);
}

const wss = new WebSocket.Server({ server });
 
app.use(cors())
app.use(express.json())

let allWsConns = []; // websocket tmp storage


// update message format
wss.on('connection', async (ws, req) => {
  try {
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
  
        // save updated state of score to db
        if (data.score == undefined) {
          console.log("Missing score object");
          return;
        }
  
        if (data.version == undefined) {
          console.log("Unknown Version of Score");
          return;
        }
  
        // check if the incoming version seems up to date
        const updatedGameObj = await client.game.updateMany({
          where: {
            name: currentGameID,
            scoreVersion: {
              lte: Number(data.version)
            }
          },
          data: {
            scores: data.score,
            scoreVersion: Number(Number(data.version) + 1)
          }
        });
  
        if (updatedGameObj.count == 0) {
          console.log("Not updated: " + Number(data.version));
        }
        else {
          console.log("Game was updated: " + Number(data.version));
        }
  
        const updatedGame = await client.game.findUnique({
          where: {
            name: currentGameID
          }
        });
  
        // loop through all potential communication partners
        // drop the ones that dont want to listen:
        for (let i = 0; i < allWsConns.length; i++){
          const conn = allWsConns[i].ws; // for readability
  
          if (conn.readyState === WebSocket.OPEN) {
            if (allWsConns[i].gameID == currentGameID) {
              // save info to db and send answer to client
              conn.send(JSON.stringify(updatedGame));
            }
          }
          else if (conn.readyState === WebSocket.CLOSED) {
            // drop it like it's hot
            console.log("Dropping connection");
            allWsConns.splice(i, 1);
          }
        }
        
    });
  }
  catch(e) {
    console.log(e);
    console.log("Fehler in der Websocket");
  }
});

app.get('/api/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await getGameInfo(gameId);
    res.json(game);
  }
  catch(e) {
    console.log(e);
  }
});

app.post(`/api/signup`, async (req, res) => {
  try {
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
  }
  catch(e) {
    console.log(e);
  }
});


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
  try {
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
  }
  catch(e) {
    console.log(e);
    res.status(500).json("Mistakes were made");
  }
  
});

app.put('/api/game/:gameId/score', async (req, res) => {
  try {
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
  }
  catch(e) {
    console.log(e);
    return res.status(500).json("Mistakes were made, or similar");
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await client.course.findMany();
    res.json(courses);
  }
  catch(e) {
    return res.status(500).json("Mistakes were made damn");
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await client.user.findMany();
    res.json(users);
  }
  catch(e){
    return res.status(500).json("Mistakes happened");
  }
});

server.listen(process.env.PORT || PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.PORT || PORT}`),
)