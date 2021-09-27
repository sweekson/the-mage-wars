<script>
import { NSpace, NInput, NButton } from 'naive-ui';

export default {
  inject: ['auth'],
  components: {
    NSpace,
    NInput,
    NButton,
  },
}
</script>

<template>
  <n-space align="start" justify="center" class="fullscreen">
    <n-space vertical justify="start" class="signup-form" @keyup.enter="auth.onSignup">
      <h1 class="signup-form-header">{{ $t('common.signup') }}</h1>

      <n-input v-model:value="auth.email" type="text" placeholder="Email address"  />
      <n-input v-model:value="auth.name" type="text" placeholder="Display name" />
      <n-input v-model:value="auth.password" type="password" placeholder="Password" />

      <n-button
        type="primary"
        block
        :disabled="!auth.email || !auth.name || !auth.password"
        @click="auth.onSignup"
      >
        {{ $t('common.signup') }}
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
.signup-form {
  border: 1px solid #666;
  border-radius: 4px;
  width: 300px;
  margin-top: 140px;
  padding: 24px 16px;
}
.signup-form-header {
  text-align: center;
}
</style>
