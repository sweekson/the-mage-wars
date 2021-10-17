<script>
import { NSpace, NButton } from 'naive-ui';

export default {
  components: {
    NSpace,
    NButton,
  },
};
</script>

<template>
  <n-space
    align="start"
    justify="center"
    class="fullscreen"
  >
    <n-space
      vertical
      align="center"
      justify="start"
      class="home"
    >
      <h1 class="home-title">
        The Mage Wars
      </h1>
      <small class="home-subtitle">
        Let's play the board game online together!
      </small>

      <n-space class="home-actions">
        <n-button
          type="info"
          ghost
          @click="$router.push('/signup')"
        >
          {{ $t('common.signup') }}
        </n-button>

        <n-button
          type="primary"
          ghost
          @click="$router.push('/login')"
        >
          {{ $t('common.login') }}
        </n-button>
      </n-space>
    </n-space>
  </n-space>
</template>

<style lang="scss" scoped>
.home {
  margin-top: 140px;
}
.home-title {
  font-size: 72px;
  font-weight: 100;
  line-height: 1;
  color: #f80;
  text-transform: uppercase;
  word-spacing: 8px;
}
// Gradient Text
@supports (-webkit-background-clip: text) {
  .home-title {
    background: -webkit-linear-gradient(#f93, #f33);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.home-subtitle {
  font-size: 24px;
  font-weight: 200;
  color: #999;
}
.home-actions {
  padding: 24px 0;
}
</style>
