<template>
  <div class="my-2">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <h2 class="text-xl font-bold">
      <em>{{ subtitle }}</em>
    </h2>
  </div>
</template>

<script>
export default {
  props: ["title", "subtitle"],
};
</script>