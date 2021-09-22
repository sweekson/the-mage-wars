<script>
export default {
  inject: ['auth'],
}
</script>

<template>
  <nav class="flexbox flexbox-center-y">
    <span class="flex-1">{{ auth.current.name }}</span>
    <button v-t="'common.logout'" type="button" @click="auth.onLogout"></button>
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
</style>