<script>
import { NGrid, NGridItem } from 'naive-ui';

import GameCampStatus from '@components/game-camp-status.vue';
import Flexbox from '@components/flexbox.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    GameCampStatus,
    Flexbox,
  },
  inject: ['game'],
};
</script>

<template>
  <div class="camps-status">
    <n-grid
      cols="3"
      x-gap="8"
    >
      <n-grid-item>
        <game-camp-status
          number="1"
          :energy="game.current.team1.energy"
        />
      </n-grid-item>

      <n-grid-item>
        <flexbox class="versus">
          <span class="versus-v">V</span>
          <span class="versus-s">S</span>
        </flexbox>
      </n-grid-item>

      <n-grid-item>
        <game-camp-status
          number="2"
          :energy="game.current.team2.energy"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.camps-status {
  padding: 24px;
}
.versus {
  font-family: fantasy;
  font-weight: bold;
  color: #fff;
  height: 100%;
  user-select: none;
  transform: translateY(20px);

  &-v {
    font-size: 76px;
    transform: translate(4px, -8px);
  }

  &-s {
    font-size: 72px;
    transform: translate(-4px);
  }
}
</style>
