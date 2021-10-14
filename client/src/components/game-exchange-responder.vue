<script>
import { NGrid, NGridItem, NDivider, NIcon } from 'naive-ui';
import ArrowDropDownOutlined from '@vicons/material/ArrowDropDownOutlined';

import GameElementSelector from '@components/game-element-selector.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    NDivider,
    NIcon,
    ArrowDropDownOutlined,
    GameElementSelector,
  },
  inject: ['game'],
};
</script>

<template>
  <section>
    <n-grid
      cols="4"
      x-gap="8"
    >
      <n-grid-item
        v-for="elem in game.exchange.requester.elems"
        :key="elem.type"
      >
        <game-element-selector
          :type="elem.name"
          :color="elem.color"
          :value="elem.amount"
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
      <n-grid-item
        v-for="elem in game.me.elems"
        :key="elem.type"
      >
        <game-element-selector
          :type="elem.name"
          :color="elem.color"
          :value="elem.selected"
          :limit="elem.amount"
          :readonly="game.exchange.isReplied"
          @update="e => game.exchange.onUpdate(elem.type, e)"
        />
      </n-grid-item>
    </n-grid>
  </section>
</template>
