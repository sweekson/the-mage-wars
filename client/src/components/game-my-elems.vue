<script>
import { NGrid, NGridItem } from 'naive-ui';

import GameIconPill from '@components/game-icon-pill.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    GameIconPill,
  },
  inject: ['game'],
};
</script>

<template>
  <n-grid
    cols="4"
    x-gap="4"
  >
    <n-grid-item
      v-for="elem in game.me.elems"
      :key="elem.type"
    >
      <game-icon-pill
        :name="elem.name"
        :color="elem.color"
        :amount="elem.amount"
      />
    </n-grid-item>
  </n-grid>
</template>
