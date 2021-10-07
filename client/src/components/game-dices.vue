<script>
import { NGrid, NGridItem, NButton } from 'naive-ui';

import GameElemDice from '@components/game-elem-dice.vue';
import Flexbox from '@components/flexbox.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    NButton,
    GameElemDice,
    Flexbox,
  },
  inject: ['game'],
};
</script>

<template>
  <div class="dices">
    <n-grid
      cols="2"
      x-gap="72"
    >
      <n-grid-item>
        <game-elem-dice
          :type="game.current.dice1"
          animation="1"
        />
      </n-grid-item>

      <n-grid-item>
        <game-elem-dice
          :type="game.current.dice2"
          animation="2"
        />
      </n-grid-item>
    </n-grid>

    <flexbox style="margin-top: 64px;">
      <n-button
        type="primary"
        size="large"
        :disabled="!game.status.isCollect"
        @click="game.action.onCollect"
      >
        Collect
      </n-button>
    </flexbox>
  </div>
</template>

<style lang="scss" scoped>
.dices {
  padding: 72px;
}
</style>
