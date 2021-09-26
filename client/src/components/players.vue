<script>
import Flexbox from '@components/flexbox';

export default {
  components: {
    Flexbox,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <flexbox class="players">
    <div
      v-for="player in list"
      :key="player.uid"
      class="player"
    >
      {{ player.name }}
    </div>
  </flexbox>
</template>

<style lang="scss" scoped>
.players {
  flex-wrap: wrap;
  gap: 4px;
}
.player {
  background-color: #f6f6f6;
  border: 1px solid #999;
  border-radius: 2px;
  width: 100%;
  padding: 4px;
}
</style>