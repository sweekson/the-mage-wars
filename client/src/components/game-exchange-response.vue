<script>
import { NGrid, NGridItem } from 'naive-ui';

import GameIconPill from '@components/game-icon-pill.vue';

export default {
  components: {
    NGrid,
    NGridItem,
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
  emits: ['select'],
};
</script>

<template>
  <div
    :class="[
      'game-exchange-response',
      { 'game-exchange-response-selected': selected },
    ]"
    @click="$emit('select', data.uid)"
  >
    <n-grid
      cols="6"
      x-gap="4"
    >
      <n-grid-item
        span="2"
        class="game-exchange-response-player"
      >
        {{ data.name }}
      </n-grid-item>

      <n-grid-item
        v-for="elem in data.elems"
        :key="elem.type"
      >
        <game-icon-pill
          :name="elem.name"
          :color="elem.color"
          :amount="elem.amount"
          :bordered="false"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.game-exchange-response {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px;

  &:hover,
  &-selected {
    border-color: #63e2b7;
  }

  &-player {
    padding: 3px 8px;
  }
}
</style>
