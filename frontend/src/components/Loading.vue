<template>
  <DefaultContainer>
    <p>Game Loading</p>
    <div class="flex justify-center">
      <img
        src="./../assets/game-loading.gif"
        height="50"
        width="50"
        class="object-contain"
        alt="Loading animation"
      />
    </div>
    <p><em>Pro Tip:</em><br />{{ proTip }}</p>
  </DefaultContainer>
</template>

<script>
export default {
  computed: {
    proTip() {
      const proTips = [
        "A healthy dose of sleep leads to better accuracy.",
        "Try out different discs.",
        "Do not throw your disc in the bushes.",
      ];
      let x = Math.floor(Math.random() * proTips.length);
      console.log(Math.floor(Math.random() * proTips.length));
      return proTips[x];
    },
  },
};
</script>