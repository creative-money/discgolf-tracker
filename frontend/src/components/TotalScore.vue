<template>
  <span
    class="p-2 flex-1 min-w-0 text-center rounded m-1 border-green-500 border sm:font-bold"
    >{{ totalScore }}</span
  >
</template>

<script>
export default {
  props: ["playerName"],
  computed: {
    totalScore() {
      return this.$store.getters.getTotalForPlayer(this.playerName);
    },
  },
};
</script>