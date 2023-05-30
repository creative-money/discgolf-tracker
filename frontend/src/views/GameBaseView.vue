<template>
  <div>
    <div v-if="activeGame">
      <Header title="Discgolf Tracker" :subtitle="$t('home.activeGame')" />
      <DefaultContainer v-if="gameLoaded">
        <Score />
      </DefaultContainer>
      <Loading v-else />
      <div class="py-2 bg-green-500 text-white shadow-sm">
        <h3 class="text-xl font-bold">{{ $t("game.invitePlayers") }}</h3>
        <p>{{ $t("game.qrHelp") }}</p>
        <div class="flex justify-center my-1">
          <QrCodeVue
            :value="'https://www.discgolf-tracker.com/game/' + gameId"
          />
        </div>
        <p>GameID: {{ gameId }}</p>
      </div>
    </div>
    <div v-else>
      <DefaultContainer>
        <h1 class="text-2xl">{{ $t("game.noGame") }}</h1>
      </DefaultContainer>
    </div>
  </div>
</template>

<script>
import DefaultContainer from "@/components/DefaultContainer.vue";
import Score from "@/components/Score.vue";
import Header from "@/components/Header.vue";
import axios from "axios";
import QrCodeVue from "qrcode.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    DefaultContainer,
    Score,
    Header,
    QrCodeVue,
    Loading,
  },
  computed: {
    holes() {
      return JSON.parse(JSON.stringify(this.$store.state.currentGame));
    },
    gameId() {
      return this.$store.state.currentGame.gameId;
    },
    activeGame() {
      return this.$store.getters.hasActiveGame;
    },
    gameLoaded() {
      return this.$store.getters.gameLoaded;
    },
  },
  methods: {
    async reloadGame(gameId) {
      if (gameId.length < 5) {
        this.gameIdFeedback = "This Game ID is too short";
      } else {
        // end game that was present before...
        this.$store.commit("endGame");
        axios.get(process.env.VUE_APP_BACKEND_DOMAIN + "/api/game/" + gameId).then((res) => {
          if (res.data == null) {
            this.gameIdFeedback = "This Game ID is unknown";
          } else {
            let score = res.data.scores;

            console.log(score);
            // save score to store :)
            this.$store.commit("updateScore", score);

            // start game...
            this.$store.commit("loadGame", res.data);
          }
        });
      }
    },
  },
  mounted() {
    console.log("Neues Baseview.");
  },
  created() {
    console.log("Game ID:" + this.$route.params.gameId);
    if ((!this.activeGame && this.$route.params.gameId != undefined) || this.gameId != this.$route.params.gameId) {
      // load game from db :)
      this.reloadGame(this.$route.params.gameId);
    }
  },
};
</script>