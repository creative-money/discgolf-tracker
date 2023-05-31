<template>
  <input
    type="number"
    inputmode="numeric"
    :class="classNames"
    v-model="score"
    @input="updateScore"
    @focus="prepareForInput"
    @blur="outOfFocus"
    min="0"
    max="20"
    :key="refresh"
  />
</template>

<script>
import {ref} from 'vue'

export default {
  props: ["initialScore", "row", "player"],
  data() {
    return {
      score: 0,
      playername: "",
      currentRow: 0,
      refresh: ref(0)
    };
  },
  created() {
    this.score = this.initialScore;
    this.playername = this.player;
    this.currentRow = this.row;
  },
  computed: {
    classNames() {
      let classNames = "p-2 flex-1 min-w-0 text-center rounded border m-1 ";
      if (this.score == 1) {
        classNames +=
          "bg-gradient-to-l from-yellow-500 to-yellow-400 border-yellow-500";
      } else if (this.score == 2) {
        classNames += "bg-yellow-400";
      } else if (this.score == 3) {
        classNames += "bg-green-400";
      } else if (this.score == 4) {
        classNames += "bg-green-300";
      } else if (this.score == 5) {
        classNames += "bg-green-200";
      } else if (this.score == 6) {
        classNames += "bg-red-100";
      } else if (this.score == 7) {
        classNames += "bg-red-200";
      } else if (this.score == 8) {
        classNames += "bg-red-300";
      } else if (this.score == 9) {
        classNames += "bg-red-400";
      } else if (this.score > 9) {
        classNames += "bg-red-500";
      }
      return classNames;
    },
    currentlyEditingScoreNode() {
      return this.$store.getters.getCurrentlyEditingScoreNode;
    },
  },
  methods: {
    updateScore() {
      this.$store.commit("updateSingleField", {
        score: Number(this.score),
        player: this.playername,
        row: this.currentRow,
      });
      this.syncScore();
    },
    async prepareForInput() {
      if (this.score == 0) {
        this.score = null;
      }
      refresh.value += 1
      // this.$store.commit("setCurrentlyEditingScoreNode", true);
      // await this.Sleep(10000);
      // if (this.currentlyEditingScoreNode) {
      //   console.log("Not editing Node anymore if you know what I mean..");
      //   this.$store.commit("setCurrentlyEditingScoreNode", false);
      // }
    },
    Sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
    outOfFocus() {
      if (this.score == null) {
        this.score = 0;
      }
      this.$store.commit("setCurrentlyEditingScoreNode", false);
    },
    syncScore() {
      this.$store.dispatch("syncScore");
    },
  },
};
</script>