<template>
  <div>
    <div class="flex justify-evenly w-100">
      <span class="px-1 py-2 w-100 flex-1 m-1 overflow-hidden sm:px-2"></span>
      <span
        class="
          border-green-500 border
          text-center text-sm
          rounded
          shadow
          px-1
          py-2
          w-100
          flex-1
          m-1
          sm:font-bold
          overflow-hidden
          sm:px-2 sm:text-md
        "
        v-for="playerName in playerNames"
        :key="playerName"
        >{{ playerName }}</span
      >
    </div>
    <div class="flex justify-evenly" v-for="(row, i) in score" :key="row">
      <span
        class="
          p-2
          flex-1
          min-w-0
          text-center
          rounded
          border
          m-1
          border-green-500
          sm:font-bold
        "
      >
        {{ i + 1 }}
      </span>
      <ScoreNode
        v-for="score in row"
        :key="score"
        :initialScore="score.score"
        :row="score.row"
        :player="score.player"
      />
    </div>
    <div class="flex justify-evenly">
      <span
        class="
          p-2
          flex-1
          min-w-0
          text-center
          rounded
          border
          m-1
          border-green-500
          sm:font-bold
        "
      >
        Total:
      </span>
      <TotalScore
        v-for="playerName in playerNames"
        :key="playerName"
        :playerName="playerName"
      />
    </div>
  </div>
</template>

<script>
import ScoreNode from "@/components/ScoreNode.vue";
import TotalScore from "@/components/TotalScore.vue";
import axios from "axios";

export default {
  components: {
    ScoreNode,
    TotalScore,
  },
  data() {
    return {
      connection: null,
    }
  },
  async created() {
    console.log("Score aufgerufen");
    this.connection = new WebSocket("wss://192.168.0.199:3000/", 'echo-protocol');

    this.connection.onmessage = function(event) {
      console.log(event);
    }

    this.connection.onopen = function(event) {
      console.log(event)
      console.log("Successfully connected to the echo websocket server...")
    }

    

    // this uploads the score:
    // this.$store.dispatch("syncScore");


    let routeStart = this.currentRouteName.substring(0,4);
    while (routeStart == "game") {
      // ... websockify
     
      await this.Sleep(12500);
      if (!this.currentlyEditingScoreNode) {
        // this.updateScore();
      }
      routeStart = this.currentRouteName.substring(0,4);
    }
  },
  methods: {
    Sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    updateScore() {
      axios
        .get(process.env.VUE_APP_BACKEND_DOMAIN + "/api/game/" + this.gameId)
        .then((res) => {
          if (res.data == null) {
            this.gameIdFeedback = "This Game ID is unknown";
          } else {
            let score = res.data.scores;
            // save score to store :)
            this.$store.commit("updateScore", score);
          }
        });
    },
  },
  computed: {
    score() {
      return this.$store.state.currentGame.scores;
    },
    currentRouteName() {
      return this.$route.name;
    },
    currentlyEditingScoreNode() {
      return this.$store.getters.getCurrentlyEditingScoreNode;
    },
    playerNames() {
      console.log(this.$store.state.currentGame.playerNames);
      return this.$store.state.currentGame.playerNames;
    },
    gameId() {
      console.log("That's the Game ID: " + this.$store.getters.getGameID);
      return this.$store.getters.getGameID;
    },
  },
};
</script>