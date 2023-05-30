<template>
  <div>
    <div class="rounded border shadow-sm m-1 flex items-center">
      <input
        class="flex-1 text-center py-2"
        v-model="newPlayerName"
        placeholder="Name"
        @input="checkName"
        v-on:keyup.enter="addPlayer()"
      />
      <button
        v-if="nameConfirmed"
        class="
          h-100
          w-100
          font-semibold
          text-sm
          bg-green-500
          text-white
          rounded
          shadow-sm
          p-3
          hover:bg-green-400
        "
        @click="addPlayer()"
      >
        +
      </button>
      <button
        v-else
        class="
          h-100
          w-100
          font-semibold
          text-sm
          bg-green-300
          text-white
          rounded
          shadow-sm
          p-3
        "
        disabled
        @click="addPlayer()"
      >
        +
      </button>
      <br />
    </div>
    {{ inputFeedback }}
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      newPlayerName: "",
      inputFeedback: "",
      nameConfirmed: false,
      inputOk: false,
    };
  },
  computed: {
    playerAvailable() {
      return this.$store.getters.playerNameAvailable(this.newPlayerName);
    },
  },
  methods: {
    addPlayer() {
      console.log("Trying to add new User: " + this.newPlayerName);
      this.checkName();
      if (this.nameConfirmed) {
        // .. add player
        this.$store.commit("addPlayers", { username: this.newPlayerName });
        this.newPlayerName = "";
        this.inputFeedback = "Player successfully added to Lobby";
      } else {
        this.inputFeedback = "This did not work please choose another Name for this player. Player names have to be unique.";
      }
    },
    checkName() {
      if (this.newPlayerName.length > 2 && this.playerAvailable) {
        this.nameConfirmed = true;
      } else {
        this.nameConfirmed = false;
      }
    },
    inputOkish() {
      if (this.newPlayerName.length > 2) {
        this.inputOk = true;
      } else {
        this.inputOk = false;
      }
    },
  },
};
</script>