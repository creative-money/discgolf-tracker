<template>
  <nav class="py-4 bg-green-500 text-white mb-4 font-bold">
    <router-link to="/">{{ $t(('navbar.home')) }}</router-link> |
    <router-link to="/about">{{ $t('navbar.info') }}</router-link>
  </nav>
</template>
