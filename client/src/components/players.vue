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
  },
}
</script>

<template>
  <section>
    <n-grid cols="1 240:2 480:4 720:6 960:8 1200:10" :x-gap="4" :y-gap="4">
      <n-grid-item
        v-for="player in list"
        :key="player.uid"
        class="player"
      >
        <n-ellipsis :tooltip="false">{{ player.name }}</n-ellipsis>
      </n-grid-item>
    </n-grid>
  </section>
</template>

<style lang="scss" scoped>
.player {
  background-color: #f6f6f6;
  border: 1px solid #999;
  border-radius: 2px;
  font-size: 14px;
  width: 100%;
  padding: 4px;
}
</style>