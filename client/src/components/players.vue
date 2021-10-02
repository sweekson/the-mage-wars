<script>
import { NGrid, NGridItem, NEllipsis } from 'naive-ui';

export default {
  components: {
    NGrid,
    NGridItem,
    NEllipsis,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    highlight: {
      type: String,
    },
  },
}
</script>

<template>
  <section>
    <n-grid cols="1 240:2 480:4 720:6 960:8 1200:10" :x-gap="4" :y-gap="4">
      <n-grid-item
        v-for="player in list"
        :key="player.uid"
        :class="['player', { 'player-highlight': highlight === player.uid }]"
      >
        <n-ellipsis :tooltip="false">{{ player.name }}</n-ellipsis>
      </n-grid-item>
    </n-grid>
  </section>
</template>

<style lang="scss" scoped>
.player {
  background-color: $color-dusk-200;
  border: 1px solid $color-dusk-300;
  border-radius: 2px;
  font-size: 14px;
  color: #eee;
  width: 100%;
  padding: 4px 8px;

  &-highlight {
    border-color: #63e2b7;
  }
}
</style>