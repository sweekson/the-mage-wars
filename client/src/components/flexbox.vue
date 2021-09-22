<script>
export default {
  props: {
    column: {
      type: Boolean,
    },
    full: {
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
</style>