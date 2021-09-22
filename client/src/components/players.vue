<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <section>
    <div
      v-for="player in list"
      :key="player.uid"
    >
      {{ player.name }}
    </div>
  </section>
</template>