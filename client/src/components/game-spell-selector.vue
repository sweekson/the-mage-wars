<script>
import { NSpace, NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';
import GameIconPill from '@components/game-icon-pill.vue';

export default {
  components: {
    NSpace,
    NGrid,
    NGridItem,
    Flexbox,
    GameIcon,
    GameIconPill,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
    },
  },
};
</script>

<template>
  <n-space
    vertical
    size="small"
    :class="{ 'spell-selected': selected }"
    @click="$emit('select', data.type)"
  >
    <flexbox class="spell-type">
      <game-icon
        :name="data.icon"
        :color="data.color"
        :size="'4xl'"
      />
    </flexbox>

    <div class="spell-costs">
      <n-grid
        cols="2"
        x-gap="4"
        y-gap="4"
      >
        <n-grid-item
          v-for="cost in data.costs"
          :key="cost.type"
        >
          <game-icon-pill
            :name="cost.name"
            :color="'silver'"
            :amount="cost.amount"
          />
        </n-grid-item>
      </n-grid>
    </div>
  </n-space>
</template>

<style lang="scss" scoped>
.spell-type {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  cursor: pointer;
  width: 146px;
  padding: 40px 0;

  &:hover {
    border-color: #63e2b7;
  }
}
.spell-selected .spell-type {
  border-color: #63e2b7;
}
.spell-cost {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 2px;
}
.spell-cost-amount {
  color: #ccc;
  user-select: none;
  flex: 1;
  padding: 0 4px;
}
</style>
