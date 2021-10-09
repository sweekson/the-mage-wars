<script>
import { NSpace, NLayout, NLayoutHeader, NLayoutContent, NGrid, NGridItem } from 'naive-ui';

import Players from '@components/players.vue';
import GameMyStatus from '@components/game-my-status.vue';
import GameTiles from '@components/game-tiles.vue';
import GameDialog from '@components/game-dialog.vue';
import GameActions from '@components/game-actions.vue';
import GameTileDetail from '@components/game-tile-detail.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  components: {
    NSpace,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NGrid,
    NGridItem,
    Players,
    GameMyStatus,
    GameTiles,
    GameDialog,
    GameActions,
    GameTileDetail,
    Flexbox,
    Loader,
  },
  inject: ['auth', 'room', 'game', 'map'],
};
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && game.isReady">
    <n-layout
      content-style="padding: 8px 8px;"
      class="game transparent"
    >
      <n-layout-header class="header transparent">
        <game-my-status />
        <h2 class="round">
          Round {{ game.current.round }}
        </h2>
      </n-layout-header>

      <n-layout class="transparent">
        <n-layout-content class="transparent">
          <n-grid
            :y-gap="16"
            responsive="self"
          >
            <n-grid-item span="4 m:3 l:2">
              <players
                :list="game.current.players"
                :highlight="game.current.action?.uid"
                colored
              />
            </n-grid-item>

            <n-grid-item span="15 m:17 l:19">
              <n-space
                align="center"
                justify="center"
              >
                <game-tiles @selected="tile => map.onSelect(tile)" />
              </n-space>
            </n-grid-item>

            <n-grid-item
              span="4 m:3 l:2"
              offset="1"
            >
              <game-actions />
            </n-grid-item>
          </n-grid>

          <game-tile-detail :data="map.selected" />
          <game-dialog />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </section>
  <flexbox
    v-else
    fullscreen
  >
    <loader />
  </flexbox>
</template>

<style lang="scss" scoped>
.transparent {
  --color: transparent !important;
}
.game {
  height: calc(100vh - 30px);
  position: relative;
}
.round {
  font-size: 24px;
  color: $text-color-reverse;
  user-select: none;
  display: flex;
  align-items: center;
  height: 32px;
  margin: 0;
  position: absolute;
  top: 0;
  left: 50%;
  opacity: .5;
  transform: translateX(-50%);

  &::before,
  &::after {
    background-color: $color-reverse;
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }

  &::before {
    transform: skewX(20deg) translateX(-15px);
  }

  &::after {
    transform: skewX(-20deg) translateX(15px);
  }
}
.header {
  height: 80px;
  position: relative;
}
</style>
