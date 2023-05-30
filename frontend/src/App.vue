<template>
  <div class="min-h-screen">
    <div>
      <Navbar />
      <router-view />
    </div>
    <InfoFooter />
  </div>
</template>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
import Navbar from "./components/Navbar.vue";
import InfoFooter from "./components/InfoFooter.vue";

export default {
  components: {
    Navbar,
    InfoFooter,
  },
  title: 'Track your score | Discgolf Tracker'
};
</script>