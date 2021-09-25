<script>
export default {
  props: {
    column: {
      type: Boolean,
    },
    full: {
      type: Boolean,
    },
    fullscreen: {
      type: Boolean,
    },
  },
}
</script>

<template>
  <div
    :class="[
      'flexbox flexbox-center',
      { 'full': full },
      { 'fullscreen': fullscreen },
      { 'flexbox-column': column },
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.full {
  height: 100%;
}
.fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>