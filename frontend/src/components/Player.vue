<template>
  <div class="rounded border shadow-sm m-1 flex items-center">
    <span class="flex-1 font-bold mx-4">
      {{ player.username }}
    </span>
    <button
      class="
        h-100
        w-100
        font-semibold
        text-sm
        bg-red-500
        text-white
        rounded
        shadow-sm
        p-3
        hover:bg-red-400
      "
      @click="removePlayer(player.username)"
    >
      x
    </button>
  </div>
</template>

<script>
export default {
  props: ["player"],
  methods: {
    removePlayer(username) {
      console.log("Trying to remove Player by Username: " + username);
      this.$store.commit("removePlayerByUsername", username);
    },
  },
};
</script>