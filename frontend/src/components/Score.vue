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
    <button @click="sendMessage('OMG ES GEEEEHT! ')">WEBSOCKET ACTION</button>
  </div>
</template>

<script>
import ScoreNode from "@/components/ScoreNode.vue";
import TotalScore from "@/components/TotalScore.vue";


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
    this.$store.dispatch("createWSConn");
  },
  methods: {
    Sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    sendMessage() {
      console.log("Trying to websocketsend")
      const message = {
        gameId: this.gameId,
        score: this.score,
      }
      this.connection.send(JSON.stringify(message));
    },
  },
  computed: {
    score() {
      console.log("Scores:",this.$store.state.currentGame.scores);
      return this.$store.state.currentGame.scores;
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