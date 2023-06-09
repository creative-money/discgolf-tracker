import { createStore } from 'vuex';
import axios from 'axios';
import createPersistedState from "vuex-persistedstate";

//for dealing with proxy objects:
import { toRaw } from 'vue';


export default createStore({
  state: {
    players: [],
    game: {
      holes: 0,
      name: "Klassiker"
    },
    connection: null,
    currentGame: {
      loaded: false,
      running: false,
      gameId: '',
      scores: [],
      playerNames: [],
      name: '',
      holes: 0,
      scoreVersion: 0,
    },
    language: {
      currentLocale: '',
    }
  },
  getters: {
    playerNameAvailable: (state) => (playerName) => {
      let duplicatePlayers = toRaw(state.players.filter(player => player.username === playerName));
      let amountOfDuplicates = duplicatePlayers.length;
      if (amountOfDuplicates > 0) {
        return false;
      }
      return true;
    },
    getCurrentLocale(state, _) {
      return toRaw(state.language.currentLocale);
    },
    getGameID(state, _) {
      return state.currentGame.gameId;
    },
    getScore(state, _) {
      return state.currentGame.scores;
    },
    getTotalForPlayer: (state) => (playerName) => {
      try {
        let totalScore = 0;
        state.currentGame.scores.forEach(row => {
          row.forEach(column => {
            if (column.player.name == playerName) {
              if (column.score != null) {
                totalScore += parseInt(column.score);
              }
            }
          });
        });
        return totalScore;
      }
      catch (e) {
        console.log(e);
        console.log("Could not calc total score");
      }
    },
    hasActiveGame(state, _) {
      return state.currentGame.running;
    },
    gameLoaded(state, _) {
      return state.currentGame.loaded;
    },
    getConnection(state) {
      return state.connection;
    }
  },
  mutations: {
    addPlayers(state, playerObj) {
      state.players.push(playerObj);
    },
    removePlayerByUsername(state, username) {
      state.players = state.players.filter(player => player.username !== username);
    },
    setHolesNumber(state, n) {
      state.game.holes = n;
    },
    setGameId(state, id) {
      console.log("Setting GameID:", id);
      state.currentGame.gameId = id;
    },
    async startGame(state, _) {
      state.currentGame.running = true;
      // prepare users and course information to provide to backend
      let players = toRaw(state.players);
      let users = [];
  
      let n = 0;
  
      while (n < players.length) {
        let player = players[n];
        users.push({ name: player.username });
        n++;
      }
  
      let course = {
        name: state.game.name,
        holes: state.game.holes,
      }
  
      axios.post(process.env.VUE_APP_BACKEND_DOMAIN + "/api/game", {
        users: users,
        course: course,
      }).then(function (response) {
        let currentPlayers = response.data.Players;
        let holes = response.data.course.holes;
        let courseName = response.data.course.name;
        let gameId = response.data.name;
        let scores = response.data.scores;
  
        console.log('CURRY GAME:', state.currentGame)
  
        currentPlayers.forEach(player => {
          let playerName = player.player.name;
          state.currentGame.playerNames.push(playerName);
        });
  
        // update state at the end...
        state.currentGame.holes = holes;
        state.currentGame.scores = scores;
        state.currentGame.name = courseName;
        state.currentGame.gameId = gameId;
        state.currentGame.loaded = true;
      }).catch(e => {
        // todo... you know... something
      })
    },
    async endGame(state, _) {
      state.currentGame = {
        gameId: '',
        scores: [],
        running: false,
        playerNames: [],
        name: '',
        holes: 0,
        loaded: false,
      };
    },
    updateScore(state, newScore) {
      state.currentGame.scores = newScore;
    },
    updateScoreVersion(state, version) {
      state.currentGame.scoreVersion = Number(version);
    },
    setConnection(state, conn) {
      state.connection = conn
    },
    loadGame(state, data) {
      state.currentGame.playerNames = [];
      state.currentGame.loaded = false;
      state.currentGame.running = true;
      state.currentGame.gameId = data.name;
  
      // set playerNames:
      data.Players.forEach(player => {
        state.currentGame.playerNames.push(player.player.name);
      });
  
      state.currentGame.name = data.course.name;
      state.currentGame.holes = data.course.holes;
      state.currentGame.loaded = true;
    },
    updateSingleField(state, data) {
      let currentRow = state.currentGame.scores[data.row];
      let count = 0;
      while (count < currentRow.length) {
        if (currentRow[count].player == data.player) {
          console.log("Upating score (from " + String(toRaw(state.currentGame.scores[data.row][count].score)) + " to " + data.score + ")");
          state.currentGame.scores[data.row][count].score = data.score;
        }
        count++;
      }
    }
  },
  actions: {
    syncScore(store) {
      const score = toRaw(store.getters.getScore);
      const gameId = toRaw(store.getters.getGameID);
      const version = toRaw(store.state.currentGame.scoreVersion);
  
      console.log("Syncing Scores... (GameID" + gameId + ")");
      const message = {
        gameId,
        score,
        version,
      }
      const connection = store.getters.getConnection;
  
      // ... check if connection is ok
      if (connection.readyState !== WebSocket.CLOSED) {
        console.log("Connection is okay... sending message...");
        connection.send(JSON.stringify(message));
      }
    },
    createWSConn(store) {
      const gameID = toRaw(store.getters.getGameID);
      const bD = String(process.env.VUE_APP_BACKEND_DOMAIN);
      axios.get(bD + "/api/game/" + gameID).then((res) => {
        console.log("Getter Response");
        console.log(res.data);
        if (res.data == null) {
          this.gameIdFeedback = "This Game ID is unknown";
        } else {
          let score = res.data.scores;
  
          console.log(score);
          // start game...
          store.commit("loadGame", res.data);
          store.commit("updateScoreVersion", res.data.scoreVersion);
        }
      }).catch(e => {
        console.log(e);
      })
      console.log("Score aufgerufen");
      let connection = new WebSocket("wss://" + bD.substring(Number(bD.indexOf("://")) + 3) + "/game/" + gameID);  
      store.commit("setConnection", connection);
    }
  },
  plugins: [createPersistedState()],
  modules: {}
})
