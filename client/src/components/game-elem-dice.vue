<script>
import { ref } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import BlankDice from '@components/blank-dice.vue';
import GameIcon from '@components/game-icon.vue';
import { resolveElemsProps } from '@composables/use-game-elems';

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
      { type: 2, face: 'bottom' },
      { type: 3, face: 'left' },
      { type: 4, face: 'right' },
    ]);

    elems.value = resolveElemsProps(elems.value);

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

    <template #back>
      <flexbox style="height: 100%;">
        <game-icon
          :name="'broken-skull'"
          :color="'silver'"
          :size="'3xl'"
        />
      </flexbox>
    </template>

    <template #top>
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
