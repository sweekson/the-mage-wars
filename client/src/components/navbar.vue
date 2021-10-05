<script>
import { NButton } from 'naive-ui';

export default {
  components: {
    NButton,
  },
  inject: ['auth'],
  computed: {
    langs() {
      return [
        { locale: 'en', text: 'English' },
        { locale: 'ja', text: '日本語' },
      ];
    },
  },
};
</script>

<template>
  <nav class="flexbox flexbox-center-y">
    <span class="flex-1">{{ auth.current.name }}</span>

    <template v-for="lang in langs">
      <button
        v-if="$i18n.locale !== lang.locale"
        :key="lang.locale"
        type="button"
        class="lang"
        @click="() => $i18n.locale = lang.locale"
      >
        {{ lang.text }}
      </button>
    </template>

    <n-button
      size="tiny"
      @click="auth.onLogout"
    >
      {{ $t('common.logout') }}
    </n-button>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  background-color: $color;
  box-shadow: 0 2px 4px #000, inset 0 2px 4px #000;
  color: #eee;
  width: 100%;
  height: 30px;
  padding: 4px;
  position: relative;
  z-index: 1;
}
.lang {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  color: #fff;
  padding: 0 8px;
}
</style>
