<script>
export default {
  methods: {
    reload() {
      location.reload();
    },
  },
};
</script>

<template>
  <section>
    <h1>400 Bad Request</h1>
    <button
      type="button"
      class="btn"
      @click="reload"
    >
      Reload
    </button>
  </section>
</template>
