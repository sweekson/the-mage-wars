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
    wrap: {
      type: Boolean,
    },
    gap: {
      type: String,
      default: '',
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
      { 'flexbox-wrap': wrap },
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
