<template>
  <div>
    <Header
      title="Discgolf Tracker"
      subtitle="The best way to keep track of your score"
    />
    <DefaultContainer>
      <h3 class="text-2xl">Join a party</h3>
      <InputWithLabel
        type="text"
        label="Enter Game ID"
        placeholder="XXXXX"
        v-model="gameId"
      />
      <Button v-if="gameId.length > 0" text="Join Game" @click="getGameInfo" />
      <Button v-else text="Enter Game ID" :disabled="true" /><br />
      <span>{{ gameIdFeedback }}</span>
    </DefaultContainer>
  </div>
</template>

<script>
import InputWithLabel from "@/components/InputWithLabel.vue";
import Header from "@/components/Header.vue";
import DefaultContainer from "@/components/DefaultContainer.vue";
import Button from "@/components/Button.vue";
import axios from "axios";

export default {
  data() {
    return {
      gameId: "",
      gameIdFeedback: "",
    };
  },
  components: {
    InputWithLabel,
    Header,
    DefaultContainer,
    Button,
  },
  methods: {
    async getGameInfo() {
      if (this.gameId.length < 5) {
        this.gameIdFeedback = "This Game ID is too short";
      } else {
        // end game that was present before...
        this.$store.commit("endGame");
        this.$router.push("/game/" + this.gameId);
      }
    },
  },
};
</script>