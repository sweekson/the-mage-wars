<script>
import { ref } from 'vue';
import { NGrid, NGridItem, NSpace, NDivider } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameElementSelector from '@components/game-element-selector.vue';
import GameExchangeResponse from '@components/game-exchange-response.vue';
import { TileTypeNameMap } from '@composables/use-game-map';

export default {
  components: {
    NGrid,
    NGridItem,
    NSpace,
    NDivider,
    Flexbox,
    GameElementSelector,
    GameExchangeResponse,
  },
  setup() {
    const responses = ref([
      {
        uid: 1,
        name: 'Tom',
        body: [
          { type: 1, name: 'drop', amount: 4 },
          { type: 2, name: 'electric', amount: 1 },
          { type: 3, name: 'flamer', amount: 0 },
          { type: 4, name: 'three-leaves', amount: 2 },
        ],
      },
      {
        uid: 2,
        name: 'Zack',
        body: [
          { type: 1, name: 'drop', amount: 3 },
          { type: 2, name: 'electric', amount: 2 },
          { type: 3, name: 'flamer', amount: 1 },
          { type: 4, name: 'three-leaves', amount: 0 },
        ],
      },
      {
        uid: 3,
        name: 'Ivan',
        body: [
          { type: 1, name: 'drop', amount: 4 },
          { type: 2, name: 'electric', amount: 1 },
          { type: 3, name: 'flamer', amount: 0 },
          { type: 4, name: 'three-leaves', amount: 2 },
        ],
      },
      {
        uid: 4,
        name: 'Bruce',
        body: [
          { type: 1, name: 'drop', amount: 3 },
          { type: 2, name: 'electric', amount: 2 },
          { type: 3, name: 'flamer', amount: 1 },
          { type: 4, name: 'three-leaves', amount: 0 },
        ],
      },
      {
        uid: 5,
        name: 'Nico',
        body: [
          { type: 1, name: 'drop', amount: 4 },
          { type: 2, name: 'electric', amount: 1 },
          { type: 3, name: 'flamer', amount: 0 },
          { type: 4, name: 'three-leaves', amount: 2 },
        ],
      },
      {
        uid: 6,
        name: 'Sherry',
        body: [
          { type: 1, name: 'drop', amount: 3 },
          { type: 2, name: 'electric', amount: 2 },
          { type: 3, name: 'flamer', amount: 1 },
          { type: 4, name: 'three-leaves', amount: 0 },
        ],
      },
    ]);
    const selected = ref(null);
    const select = (uid) => (selected.value = uid);

    return {
      TileTypeNameMap,
      responses,
      selected,
      select,
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

    <n-space vertical class="exchange-responses">
      <flexbox v-if="!responses.length" class="empty-response">
        Waiting for others to reply
      </flexbox>

      <n-grid v-else cols="1" y-gap="8" class="">
        <n-grid-item v-for="response in responses" :key="response.uid">
          <game-exchange-response
            :data="response"
            :selected="selected === response.uid"
            @select="select"
          />
        </n-grid-item>
      </n-grid>
    </n-space>
  </section>
</template>

<style lang="scss" scoped>
.exchange-responses {
  max-height: 200px;
  overflow: auto;
}
.empty-response {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 64px 0;
}
</style>