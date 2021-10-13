<script>
import { ref } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import BlankDice from '@components/blank-dice.vue';
import GameIcon from '@components/game-icon.vue';
import { resolveTileTypeName, resolveTileTypeColor } from '@composables/use-game-map';
import { pipe } from '../utils/common';

export default {
  components: {
    NGrid,
    NGridItem,
    Flexbox,
    BlankDice,
    GameIcon,
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
    animation: {
      type: String,
      default: '1',
    },
  },
  setup() {
    const elems = ref([
      { type: 1, face: 'front' },
      { type: 2, face: 'back' },
      { type: 3, face: 'right' },
      { type: 4, face: 'left' },
    ]);
    const resolveElemProps = pipe(
      resolveTileTypeName,
      resolveTileTypeColor,
    );

    elems.value = resolveElemProps(elems.value);

    return { elems };
  },
};
</script>

<template>
  <blank-dice
    :face="type"
    :animation="animation"
    autoplay
  >
    <template
      v-for="elem in elems"
      #[elem.face]
      :key="elem.type"
    >
      <flexbox style="height: 100%;">
        <game-icon
          :name="elem.name"
          :color="elem.color"
          :size="'3xl'"
        />
      </flexbox>
    </template>

    <template #top>
      <flexbox style="height: 100%;">
        <game-icon
          :name="'broken-skull'"
          :color="'silver'"
          :size="'3xl'"
        />
      </flexbox>
    </template>

    <template #bottom>
      <n-grid
        cols="2"
        style="place-items: center; height: 100%; padding: 12px;"
      >
        <n-grid-item
          v-for="elem in elems"
          :key="elem.type"
        >
          <game-icon
            :name="elem.name"
            :color="elem.color"
            :size="'md'"
          />
        </n-grid-item>
      </n-grid>
    </template>
  </blank-dice>
</template>
