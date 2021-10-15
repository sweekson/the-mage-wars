<script>
import { inject, computed } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';
import GameIconPill from '@components/game-icon-pill.vue';
import { resolveElemIconProps, resolveElemsProps } from '@composables/use-game-elems';

export default {
  components: {
    NGrid,
    NGridItem,
    Flexbox,
    GameIcon,
    GameIconPill,
  },
  setup() {
    const game = inject('game');
    const elem = computed(
      () => resolveElemIconProps(game.current.action.tile),
    );
    const costs = resolveElemsProps([
      { type: 1, amount: 2 },
      { type: 2, amount: 2 },
      { type: 3, amount: 2 },
      { type: 4, amount: 2 },
    ]);
    return { elem, costs };
  },
};
</script>

<template>
  <flexbox
    gap="4px"
    style="align-items: stretch;"
  >
    <flexbox class="tile-resource">
      <game-icon
        :name="elem.name"
        :color="elem.color"
        size="2xl"
      />
    </flexbox>

    <flexbox
      column
      gap="4px"
    >
      <flexbox class="tile-message flex-1">
        Do you want to consume elements to occupy the resources?
      </flexbox>

      <n-grid
        cols="4"
        x-gap="4"
      >
        <n-grid-item
          v-for="cost in costs"
          :key="cost.type"
        >
          <game-icon-pill
            :name="cost.name"
            :color="cost.color"
            :amount="cost.amount"
          />
        </n-grid-item>
      </n-grid>
    </flexbox>
  </flexbox>
</template>

<style lang="scss" scoped>
.tile-resource,
.tile-message {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
}
.tile-resource {
  width: 80px;
}
.tile-message {
  line-height: 1.5;
  width: 280px;
  padding: 16px;
}
</style>
