<script>
import { NSlider } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameTile from '@components/game-tile.vue';
import { TileSizeMap } from '@composables/use-game-map';

export default {
  components: {
    NSlider,
    Flexbox,
    GameTile,
  },
  inject: ['game'],
  emits: ['selected'],
  setup() {
    return { TileSizeMap };
  },
};
</script>

<template>
  <section style="margin: 0 4px;">
    <div class="tile-size-control">
      <n-slider
        v-model:value="game.map.extent"
        :marks="{ 1: 'S', 2: 'M', 3: 'L' }"
        :step="3"
        :min="1"
        :max="3"
        :tooltip="false"
        class="tile-size-slider"
      />
    </div>
    <flexbox
      class="tiles"
      gap="5px"
      wrap
      :style="{ width: game.map.width }"
    >
      <game-tile
        v-for="(tile, index) in game.map.tiles"
        :key="tile.order"
        :data="tile"
        :size="TileSizeMap[game.map.extent]"
        :tabindex="index + 1"
        @selected="$emit('selected', tile)"
      />
    </flexbox>
  </section>
</template>

<style lang="scss" scoped>
.tile-size-control {
  display: flex;
  justify-content: flex-end;
}
.tile-size-slider {
  --fill-color: #ccc !important;
  --fill-color-hover: #fff !important;
  --dot-border: 2px solid #ccc !important;
  --dot-border-active: 2px solid #fff !important;
  --dot-border-radius: 5px !important;
  --dot-width: 10px !important;
  --dot-height: 10px !important;
  --handle-size: 12px !important;
  --rail-height: 2px !important;
  width: 50%;
}
</style>
