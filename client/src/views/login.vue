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
      <h2 v-t="'common.login'"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.password" type="password" />
      <button v-t="'common.login'" type="button" @click="auth.onLogin"></button>
      <button v-t="'common.back'" type="button" @click="$router.push('/')"></button>
    </form>
  </Flexbox>
</template>