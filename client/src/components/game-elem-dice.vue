<script>
import { ref } from 'vue';
import { NGrid, NGridItem } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import Dice from '@components/dice.vue';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    Flexbox,
    Dice,
    GameIcon,
  },
  props: {
    type: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const elems = ref([
      { type: 1, name: 'drop', color: 'cyan', face: 'front' },
      { type: 2, name: 'electric', color: 'yellow', face: 'back' },
      { type: 3, name: 'flamer', color: 'volcano', face: 'right' },
      { type: 4, name: 'three-leaves', color: 'green', face: 'left' },
    ]);
    const rolling = ref(true);
    return { elems, rolling };
  },
}
</script>

<template>
  <dice :face="type" :rolling="rolling" @click="rolling = !rolling">
    <template v-for="elem in elems" v-slot:[elem.face] :key="elem.type">
      <flexbox style="height: 100%;">
        <game-icon
          :name="elem.name"
          :color="elem.color"
          :size="'3xl'"
        />
      </flexbox>
    </template>

    <template v-slot:top>
      <flexbox style="height: 100%;">
        <game-icon
          :name="'broken-skull'"
          :color="'silver'"
          :size="'xl'"
        />
      </flexbox>
    </template>

    <template v-slot:bottom>
      <n-grid cols="2" style="height: 100%; padding: 12px;">
        <flexbox v-for="elem in elems" :key="elem.type">
          <game-icon
            :name="elem.name"
            :color="elem.color"
            :size="'md'"
          />
        </flexbox>
      </n-grid>
    </template>
  </dice>
</template>
