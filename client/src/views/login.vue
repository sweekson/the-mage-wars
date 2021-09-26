<script>
import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['auth'],
  components: {
    Flexbox,
  },
}
</script>

<template>
  <flexbox full>
    <form class="flexbox-column" @keyup.enter="auth.onLogin">
      <h2 v-html="$t('common.login')"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.password" type="password" />
      <button
        v-html="$t('common.login')"
        class="btn btn-block"
        type="button"
        @click="auth.onLogin"
      />
      <button
        v-html="$t('common.back')"
        class="btn btn-block"
        type="button"
        @click="$router.push('/')"
      />
    </form>
  </flexbox>
</template>