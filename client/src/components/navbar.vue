<script>
export default {
  inject: ['auth'],
  computed: {
    langs() {
      return [
        { locale: 'en', text: 'English' },
        { locale: 'ja', text: '日本語' },
      ];
    },
  },
}
</script>

<template>
  <nav class="flexbox flexbox-center-y">
    <span class="flex-1">{{ auth.current.name }}</span>

    <template v-for="lang in langs">
      <button
        v-if="$i18n.locale !== lang.locale"
        v-html="lang.text"
        :key="lang.locale"
        type="button"
        class="lang"
        @click="() => $i18n.locale = lang.locale"
      />
    </template>

    <button
      v-html="$t('common.logout')"
      class="btn"
      type="button"
      @click="auth.onLogout"
    />
  </nav>
</template>

<style scoped>
nav {
  background-color: #444;
  color: #eee;
  width: 100%;
  height: 30px;
  padding: 4px;
}
.lang {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  color: #fff;
  padding: 0 8px;
}
</style>