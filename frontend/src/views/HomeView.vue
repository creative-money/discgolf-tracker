<template>
  <div>
    <Header title="Discgolf Tracker" :subtitle="$t('home.catchPhrase')" />
    <router-link :to="'/game/' + gameId" v-if="activeGame">
      <Button :text="$t('home.activeGame')" />
    </router-link>
    <router-link to="/lobby">
      <Button :text="$t('home.newGame')" />
    </router-link>
    <router-link to="/joinGame">
      <Button :text="$t('home.joinGame')" />
    </router-link>
  </div>
</template>
<script>
// @ is an alias to /src
import Button from "@/components/Button.vue";
import Header from "@/components/Header.vue";

export default {
  name: "HomeView",
  components: {
    Button,
    Header,
  },
  computed: {
    activeGame() {
      return this.$store.getters.hasActiveGame;
    },
    gameId() {
      return this.$store.state.currentGame.gameId;
    },
  },
};
</script>
