<template>
  <div class="about">
    <Header title="Discgolf Tracker" :subtitle="$t('about.aboutUs')" />
    <p>{{ $t("about.catchPhrase") }}</p>
    <DefaultContainer class="my-2">
      <h3 class="font-bold text-xl">{{ $t("about.FAQ.title") }}</h3>
      <QuestionAndAnswer
        :question="$t('about.FAQ.q1.question')"
        :answer="$t('about.FAQ.q1.answer')"
      />
      <QuestionAndAnswer
        :question="$t('about.FAQ.q2.question')"
        :answer="$t('about.FAQ.q2.answer')"
      />
      <QuestionAndAnswer
        :question="$t('about.FAQ.q3.question')"
        :answer="$t('about.FAQ.q3.answer')"
      />
    </DefaultContainer>
    <LanguageSwitcher />
  </div>
</template>

<script>
import DefaultContainer from "@/components/DefaultContainer.vue";
import Header from "@/components/Header.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import QuestionAndAnswer from "@/components/QuestionAndAnswer.vue";

export default {
  methods: {},
  components: {
    Header,
    DefaultContainer,
    LanguageSwitcher,
    QuestionAndAnswer,
  },
  data() {
    return {
      courses: [],
    };
  },
};
</script>