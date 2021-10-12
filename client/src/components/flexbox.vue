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
    gap: {
      type: String,
      default: '0',
    },
  },
};
</script>

<template>
  <div
    :class="[
      'flexbox flexbox-center',
      { 'full': full },
      { 'fullscreen': fullscreen },
      { 'flexbox-column': column },
    ]"
    :style="{ gap }"
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
