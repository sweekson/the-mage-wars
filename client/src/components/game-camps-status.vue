<script>
import { NGrid, NGridItem, NProgress } from 'naive-ui';

import GameCampBanner from '@components/game-camp-banner.vue';
import Flexbox from '@components/flexbox.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    NProgress,
    GameCampBanner,
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
        <h4 class="camp-title">
          Camp 1
        </h4>
        <game-camp-banner
          :color="!game.current.team1.energy ? 'gray' : 'red'"
        />
        <n-progress
          :percentage="game.current.team1.energy"
          :data-value="game.current.team1.energy"
          :show-indicator="false"
          type="line"
          color="#fa4"
          :height="8"
          :class="[
            'camp-energy',
            { 'camp-energy-zero': !game.current.team1.energy },
          ]"
        />
      </n-grid-item>

      <n-grid-item>
        <flexbox class="versus">
          <span class="versus-v">V</span>
          <span class="versus-s">S</span>
        </flexbox>
      </n-grid-item>

      <n-grid-item>
        <h4 class="camp-title">
          Camp 2
        </h4>
        <game-camp-banner
          :color="!game.current.team2.energy ? 'gray' : 'navy'"
        />
        <n-progress
          :percentage="game.current.team2.energy"
          :data-value="game.current.team2.energy"
          :show-indicator="false"
          type="line"
          color="#fa4"
          :height="8"
          :class="[
            'camp-energy',
            { 'camp-energy-zero': !game.current.team2.energy },
          ]"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.camps-status {
  padding: 24px;
}
.camp-title {
  font-size: 20px;
  font-weight: 200;
  text-align: center;
  margin-bottom: 12px;
}
.camp-energy {
  margin-top: 24px;

  &::before {
    content: attr(data-value) "%";
    font-size: 12px;
    font-weight: 200;
    line-height: 2;
    text-align: center;
    color: #fa4;
    display: block;
    width: 100%;
  }

  &-zero::before {
    color: #666;
  }
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
