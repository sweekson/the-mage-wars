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
      <h2 v-t="'common.signup'"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.name" type="text" />
      <input v-model="auth.password" type="password" />
      <button v-t="'common.signup'" type="button" @click="auth.onSignup"></button>
      <button v-t="'common.back'" type="button" @click="$router.push('/')"></button>
    </form>
  </Flexbox>
</template>