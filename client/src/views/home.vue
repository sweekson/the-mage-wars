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
        Welcome
      </h1>
      <small class="home-subtitle">
        Let's play the board game online together!
      </small>

      <n-space>
        <n-button
          type="info"
          @click="$router.push('/signup')"
        >
          {{ $t('common.signup') }}
        </n-button>

        <n-button
          type="primary"
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
  font-size: 4em;
}
.home-subtitle {
  font-size: 1.5em;
  font-weight: 200;
  color: #999;
}
</style>
