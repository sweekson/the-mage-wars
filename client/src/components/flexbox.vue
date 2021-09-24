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
  <section
    :class="[
      'flexbox flexbox-center',
      { 'full': full },
      { 'fullscreen': fullscreen },
      { 'flexbox-column': column },
    ]"
  >
    <slot />
  </section>
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