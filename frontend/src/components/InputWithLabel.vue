<template>
  <div class="mt-1">
    <label :for="id" class="block text-sm font-medium text-slate-700">{{
      label
    }}</label>
    <input
      v-if="type == 'text'"
      type="text"
      :id="id"
      :placeholder="placeholder"
      :class="classNames"
      @input="$emit('update:modelValue', $event.target.value)"
      :model="modelValue"
    />
    <input
      v-else-if="type == 'number'"
      type="number"
      inputmode="numeric"
      :id="id"
      :placeholder="placeholder"
      :min="min"
      :class="classNames"
      @input="$emit('update:modelValue', $event.target.value)"
      :model="modelValue"
    />
  </div>
</template>

<script>
// heavily inspired from:
// https://www.youtube.com/watch?v=CALrQCw41dI
// (...watch to understand v-model with custom components)

export default {
  data() {
    return {
      classNames: `px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none`,
    };
  },
  props: {
    modelValue: {
      type: String,
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      default: 0,
    },
  },
};
</script>