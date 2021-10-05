<script>
export default {
  inject: ['logger'],
};
</script>

<template>
  <section class="logs">
    <div>
      <button
        class="btn btn-block"
        type="button"
        @click="logger.clear"
      >
        Clear
      </button>
    </div>

    <div
      v-for="(log, index) in logger.logs"
      :key="index"
    >
      {{ log.time }} {{ log.text }}
    </div>
  </section>
</template>

<style scoped>
.logs {
  border-left: 1px solid #ccc;
  line-height: 1.25;
  white-space: nowrap;
  padding: 4px;
  width: 300px;
  overflow-y: auto;
}
</style>
