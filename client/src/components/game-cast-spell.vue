<script>
import { NSpace, NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameSpellSelector from '@components/game-spell-selector.vue';

export default {
  components: {
    NSpace,
    NGrid,
    NGridItem,
    Flexbox,
    GameSpellSelector,
  },
  inject: ['game'],
};
</script>

<template>
  <n-space vertical>
    <flexbox class="cast-message">
      <span v-if="!game.cast.selected">Select a spell to see the detail</span>
      <span v-else>{{ game.cast.selected.description.trim() }}</span>
    </flexbox>

    <n-grid
      cols="3"
      x-gap="8"
    >
      <n-grid-item
        v-for="spell in game.cast.spells"
        :key="spell.type"
      >
        <game-spell-selector
          :data="spell"
          :selected="game.cast.selected?.type === spell.type"
          @select="game.cast.onSelect"
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
  line-height: 1.5;
  text-align: center;
  white-space: pre-line;
  height: 60px;
  padding: 8px;
}
</style>
