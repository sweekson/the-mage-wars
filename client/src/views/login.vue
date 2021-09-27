<script>
import { inject } from 'vue';
import { NSpace, NInput, NButton, useMessage } from 'naive-ui';

export default {
  inject: ['auth'],
  components: {
    NSpace,
    NInput,
    NButton,
  },
  setup() {
    const auth = inject('auth');
    const message = useMessage();

    auth.on(
      'unauthenticated',
      () => message.error('Incorrect email address or password.'),
    );
  },
}
</script>

<template>
  <n-space align="start" justify="center" class="fullscreen">
    <n-space vertical justify="start" class="login-form" @keyup.enter="auth.onLogin">
      <h1 class="login-form-header">{{ $t('common.login') }}</h1>

      <n-input v-model:value="auth.email" type="text" placeholder="Email address" />
      <n-input v-model:value="auth.password" type="password" placeholder="Password" />

      <n-button
        type="primary"
        block
        :disabled="!auth.email || !auth.password"
        @click="auth.onLogin"
      >
        {{ $t('common.login') }}
      </n-button>

      <n-button
        block
        @click="$router.push('/')"
      >
        {{ $t('common.back') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<style lang="scss" scoped>
.login-form {
  border: 1px solid #666;
  border-radius: 4px;
  width: 300px;
  margin-top: 140px;
  padding: 24px 16px;
}
.login-form-header {
  text-align: center;
}
</style>