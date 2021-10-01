<script>
import { NGrid, NGridItem, NSpace, NDivider } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameElementSelector from '@components/game-element-selector.vue';
import { TileTypeNameMap } from '@composables/use-game-map';

export default {
  components: {
    NGrid,
    NGridItem,
    NSpace,
    NDivider,
    Flexbox,
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
          :value="999"
          :limit="999"
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

    <n-divider />

    <n-space vertical class="exchange-candidates">
      <flexbox class="empty-response">
        Waiting for others to reply
      </flexbox>
    </n-space>
  </section>
</template>

<style lang="scss" scoped>
.exchange-candidates {
}
.empty-response {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 64px 0;
}
</style>