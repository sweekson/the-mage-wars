<script>
import { NGrid, NGridItem, NDivider, NIcon } from 'naive-ui';
import ArrowDropDownOutlined from '@vicons/material/ArrowDropDownOutlined';

import GameElementSelector from '@components/game-element-selector.vue';
import { TileTypeNameMap, TileTypeColorMap } from '@composables/use-game-map';

export default {
  components: {
    NGrid,
    NGridItem,
    NDivider,
    NIcon,
    ArrowDropDownOutlined,
    GameElementSelector,
  },
  setup() {
    return {
      TileTypeNameMap,
      TileTypeColorMap,
    };
  },
};
</script>

<template>
  <section>
    <n-grid
      cols="4"
      x-gap="8"
    >
      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[1]"
          :color="TileTypeColorMap[1]"
          :value="50"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[2]"
          :color="TileTypeColorMap[2]"
          :value="0"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[3]"
          :color="TileTypeColorMap[3]"
          :value="10"
          readonly
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[4]"
          :color="TileTypeColorMap[4]"
          :value="0"
          readonly
        />
      </n-grid-item>
    </n-grid>

    <n-divider>
      <n-icon size="26">
        <arrow-drop-down-outlined />
      </n-icon>
      <span>My Response</span>
      <n-icon size="26">
        <arrow-drop-down-outlined />
      </n-icon>
    </n-divider>

    <n-grid
      cols="4"
      x-gap="8"
    >
      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[1]"
          :color="TileTypeColorMap[1]"
          :value="0"
          :limit="20"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[2]"
          :color="TileTypeColorMap[2]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[3]"
          :color="TileTypeColorMap[3]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>

      <n-grid-item>
        <game-element-selector
          :type="TileTypeNameMap[4]"
          :color="TileTypeColorMap[4]"
          :value="0"
          :limit="10"
        />
      </n-grid-item>
    </n-grid>
  </section>
</template>
