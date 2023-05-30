<template>
  <button
    v-if="!disabled"
    class="
      px-4
      py-2
      font-semibold
      text-sm
      bg-green-500
      text-white
      rounded
      shadow-sm
      m-3
    "
  >
    {{ text }}
  </button>
  <button
    v-else-if="disabled"
    disabled
    class="
      px-4
      py-2
      font-semibold
      text-sm
      bg-green-200
      text-white
      rounded
      shadow-sm
      m-3
    "
  >
    {{ text }}
  </button>
</template>

<script>
// props are used to (send and/but in this file) receive information...

export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>