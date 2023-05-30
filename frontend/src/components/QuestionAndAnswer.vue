<template>
  <p class="mt-3">
    <em>{{ question }}</em
    ><br />
    {{ answer }}
  </p>
</template>

<script>
export default {
  props: ["question", "answer"],
};
</script>