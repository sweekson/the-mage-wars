<script>
import { ref } from 'vue';
import { NGrid, NGridItem, NSpace, NDivider } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameElementSelector from '@components/game-element-selector.vue';
import GameExchangeResponse from '@components/game-exchange-response.vue';
import {
  TileTypeNameMap,
  TileTypeColorMap,
  resolveTileTypeName,
  resolveTileTypeColor,
} from '@composables/use-game-map';
import { pipe } from '../utils/common';

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
  inject: ['game'],
  setup() {
    const responses = ref([
      {
        uid: 1,
        name: 'Tom',
        body: [
          { type: 1, amount: 4 },
          { type: 2, amount: 1 },
          { type: 3, amount: 0 },
          { type: 4, amount: 2 },
        ],
      },
      {
        uid: 2,
        name: 'Zack',
        body: [
          { type: 1, amount: 3 },
          { type: 2, amount: 2 },
          { type: 3, amount: 1 },
          { type: 4, amount: 0 },
        ],
      },
      {
        uid: 3,
        name: 'Ivan',
        body: [
          { type: 1, amount: 4 },
          { type: 2, amount: 1 },
          { type: 3, amount: 0 },
          { type: 4, amount: 2 },
        ],
      },
      {
        uid: 4,
        name: 'Bruce',
        body: [
          { type: 1, amount: 3 },
          { type: 2, amount: 2 },
          { type: 3, amount: 1 },
          { type: 4, amount: 0 },
        ],
      },
      {
        uid: 5,
        name: 'Nico',
        body: [
          { type: 1, amount: 4 },
          { type: 2, amount: 1 },
          { type: 3, amount: 0 },
          { type: 4, amount: 2 },
        ],
      },
      {
        uid: 6,
        name: 'Sherry',
        body: [
          { type: 1, amount: 3 },
          { type: 2, amount: 2 },
          { type: 3, amount: 1 },
          { type: 4, amount: 0 },
        ],
      },
    ]);
    const selected = ref(null);
    const select = (uid) => (selected.value = uid);
    const resolveElemProps = pipe(
      resolveTileTypeName,
      resolveTileTypeColor,
    );

    responses.value.forEach(x => {
      Object.assign(x, { body: resolveElemProps(x.body) });
    });

    return {
      TileTypeNameMap,
      TileTypeColorMap,
      responses,
      selected,
      select,
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
      <n-grid-item
        v-for="elem in game.me.elems"
        :key="elem.type"
      >
        <game-element-selector
          :type="elem.name"
          :color="elem.color"
          :value="elem.selected"
          :limit="elem.amount"
          @update="e => game.exchange.onUpdate(elem.type, e)"
        />
      </n-grid-item>
    </n-grid>

    <n-divider />

    <n-space
      vertical
      class="exchange-responses"
    >
      <flexbox
        v-if="!responses.length"
        class="empty-response"
      >
        Waiting for others to reply
      </flexbox>

      <n-grid
        v-else
        cols="1"
        y-gap="8"
        class=""
      >
        <n-grid-item
          v-for="response in responses"
          :key="response.uid"
        >
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
