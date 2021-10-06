<script>
import { ref } from 'vue';
import { NSpace, NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameSpellSelector from '@components/game-spell-selector.vue';
import { resolveTileTypeName, resolveTileTypeColor } from '@composables/use-game-map';
import { pipe } from '../utils/common';

export default {
  components: {
    NSpace,
    NGrid,
    NGridItem,
    Flexbox,
    GameSpellSelector,
  },
  setup() {
    const selected = ref(null);
    const spells = [
      {
        type: 'basic',
        icon: 'orb-wand',
        costs: [
          { type: 1, amount: 2 },
          { type: 2, amount: 4 },
          { type: 3, amount: 3 },
          { type: 4, amount: 2 },
        ],
      },
      {
        type: 'advanced',
        icon: 'gift-of-knowledge',
        costs: [
          { type: 1, amount: 6 },
          { type: 2, amount: 4 },
          { type: 3, amount: 5 },
          { type: 4, amount: 7 },
        ],
      },
      {
        type: 'investigation',
        icon: 'cowled',
        costs: [
          { type: 1, amount: 8 },
          { type: 2, amount: 8 },
          { type: 3, amount: 8 },
          { type: 4, amount: 8 },
        ],
      },
    ];
    const select = (type) => (selected.value = type);
    const resolveElemProps = pipe(
      resolveTileTypeName,
      resolveTileTypeColor,
    );

    spells.forEach(x => {
      Object.assign(x, { costs: resolveElemProps(x.costs) });
    });

    return {
      selected,
      spells,
      select,
    };
  },
};
</script>

<template>
  <n-space vertical>
    <flexbox class="cast-message">
      <span>Select a spell to see the detail</span>
    </flexbox>

    <n-grid
      cols="3"
      x-gap="8"
    >
      <n-grid-item
        v-for="spell in spells"
        :key="spell.type"
      >
        <game-spell-selector
          :data="spell"
          :selected="selected === spell.type"
          @select="select"
        />
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

<style lang="scss" scoped>
.cast-message {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 8px;
}
</style>
