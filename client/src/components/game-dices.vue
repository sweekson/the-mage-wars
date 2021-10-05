<script>
import { NGrid, NGridItem } from 'naive-ui';

import GameElemDice from '@components/game-elem-dice.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    GameElemDice,
  },
};
</script>

<template>
  <div class="dices">
    <n-grid
      cols="2"
      x-gap="72"
    >
      <n-grid-item>
        <game-elem-dice :type="2" />
      </n-grid-item>

      <n-grid-item>
        <game-elem-dice :type="5" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.dices {
  padding: 72px;
}
</style>
