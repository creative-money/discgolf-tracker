<template>
  <div>
    <div v-if="!activeGame">
      <Header title="Discgolf Tracker" subtitle="Set up Game" />
      <DefaultContainer>
        <h3 class="text-2xl">Party</h3>
        <div class="flex flex-wrap">
          <Player v-for="player in players" :key="player" :player="player" />
        </div>
        <label
          :for="id"
          class="block text-sm font-medium text-slate-700 mt-1"
          >{{ $t("lobby.addPlayers") }}</label
        >
        <NewPlayer />
      </DefaultContainer>
      <DefaultContainer>
        <h3 class="text-2xl">{{ $t("lobby.gameSettings") }}</h3>
        <InputWithLabel
          :label="$t('lobby.holeExplainer')"
          type="number"
          placeholder="9"
          v-model="amountOfHoles"
          class="mt-3"
          min="0"
          max="50"
        />
        <Button
          v-if="settingsOk"
          :text="$t('lobby.startGame')"
          @click="startGame"
        />
        <Button v-else :text="$t('lobby.startGame')" :disabled="true" />
      </DefaultContainer>
    </div>
    <div v-else-if="gameLoaded">
      <Header title="Discgolf Tracker" :subtitle="$t('lobby.catchPhrase')" />
      <DefaultContainer>
        <h2 class="text-xl">{{ $t("lobby.endGameHeader") }}</h2>
        <p>{{ $t("lobby.endGameText") + gameId }}.</p>
        <Button
          @click="endGame"
          :text="$t('lobby.endGameButtonText')"
          class="bg-red-500"
        />
      </DefaultContainer>
    </div>
    <Loading v-if="!gameLoaded && activeGame" />
  </div>
</template>

<script>
import InputWithLabel from "@/components/InputWithLabel.vue";
import DefaultContainer from "@/components/DefaultContainer.vue";
import Button from "@/components/Button.vue";
import Player from "@/components/Player.vue";
import NewPlayer from "@/components/NewPlayer.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    InputWithLabel,
    DefaultContainer,
    Button,
    Player,
    NewPlayer,
    Header,
    Loading,
  },
  data() {
    return {
      amountOfHoles: 0,
    };
  },
  computed: {
    players() {
      return this.$store.state.players;
    },
    gameLoaded() {
      return this.$store.getters.gameLoaded;
    },
    settingsOk() {
      if (this.players.length > 0) {
        if (this.amountOfHoles > 0) {
          if (this.amountOfHoles < 20) {
            return true;
          } else {
            return false;
          }
        }
        {
          return false;
        }
      } else {
        return false;
      }
    },
    gameId() {
      return this.$store.getters.getGameID;
    },
    activeGame() {
      return this.$store.getters.hasActiveGame;
    },
  },
  methods: {
    setAmountOfHoles() {
      this.$store.commit("setHolesNumber", this.amountOfHoles);
    },
    endGame() {
      this.$store.commit("endGame");
    },
    async startGame() {
      //todo: start game on backend and receive data from there.
      this.$store.commit("endGame");
      this.setAmountOfHoles();
      this.$store.commit("startGame");
    },
  },
  watch: {
    async gameId(newGameId, oldGameId) {
      if (newGameId != "" && newGameId != undefined) {
        this.$router.push("/game/" + newGameId);
      }
    },
  },
};
</script>