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
  <Flexbox full>
    <form class="flexbox-column" @keyup.enter="auth.onLogin">
      <h2 v-html="$t('common.login')"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.password" type="password" />
      <button v-html="$t('common.login')" type="button" @click="auth.onLogin"></button>
      <button v-html="$t('common.back')" type="button" @click="$router.push('/')"></button>
    </form>
  </Flexbox>
</template>