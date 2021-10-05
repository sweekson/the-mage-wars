<script>
import { ref } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';

import GameIconPill from '@components/game-icon-pill.vue';
import { resolveTileTypeName, resolveTileTypeColor } from '@composables/use-game-map';
import { pipe } from '../utils/common';

export default {
  components: {
    NGrid,
    NGridItem,
    GameIconPill,
  },
  setup() {
    const elems = ref([
      { type: 1, amount: 999 },
      { type: 2, amount: 999 },
      { type: 3, amount: 999 },
      { type: 4, amount: 999 },
    ]);
    const resolveElemProps = pipe(
      resolveTileTypeName,
      resolveTileTypeColor,
    );

    elems.value = resolveElemProps(elems.value);

    return {
      elems,
    };
  },
}
</script>

<template>
  <n-grid cols="4" x-gap="4">
    <n-grid-item v-for="elem in elems" :key="elem.type">
      <game-icon-pill
        :name="elem.name"
        :color="elem.color"
        :amount="elem.amount"
      />
    </n-grid-item>
  </n-grid>
</template>