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
            :value="qrCodeValue"
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
    qrCodeValue() {
      return process.env.VUE_APP_FRONTEND_DOMAIN + "/game/" + this.gameId;
    },
    holes() {
      return JSON.parse(JSON.stringify(this.$store.state.currentGame));
    },

    activeGame() {
      return true;//this.$store.getters.hasActiveGame;
    },
    gameLoaded() {
      return true; //his.$store.getters.gameLoaded;
    },
  },
  mounted() {
    console.log("Neues Baseview.");
  },
  created() {
    this.$store.commit("setGameId", this.$route.params.gameId);
  },
};
</script>