<template>
  <DefaultContainer>
    <h1 class="text-xl">{{ $t("languageSwitcher.explain") }}</h1>
    <select v-model="$i18n.locale" @change="onLanguageChange">
      <option v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </DefaultContainer>
</template>

<script>
import DefaultContainer from "@/components/DefaultContainer.vue";
export default {
  data() {
    return { langs: ["en", "de"] };
  },
  components: {
    DefaultContainer,
  },
  methods: {
    onLanguageChange() {
      this.$store.state.language.currentLocale = this.$i18n.locale;

      console.log(this.$store.getters.getCurrentLocale);
    },
  },
};
</script>