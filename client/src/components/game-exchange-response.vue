<script>
import { NGrid, NGridItem, NDivider } from 'naive-ui';

import GameElementSelector from '@components/game-element-selector.vue';
import { TileTypeNameMap } from '@composables/use-game-map';

export default {
  components: {
    NGrid,
    NGridItem,
    NDivider,
    GameElementSelector,
  },
  setup() {
    return {
      TileTypeNameMap,
    };
  },
}
</script>

<template>
  <section>
    <n-grid cols="4" x-gap="8">
      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[1]"
          :value="50"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[2]"
          :value="0"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[3]"
          :value="10"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[4]"
          :value="0"
          readonly
        />
      </n-grid-item>
    </n-grid>

    <n-divider />

    <n-grid cols="4" x-gap="8">
      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[1]"
          :value="0"
          :limit="20"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[2]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[3]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[4]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>
    </n-grid>
  </section>
</template>
