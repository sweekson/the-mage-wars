<script>
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui';

import Players from '@components/players.vue';
import GameMyStatus from '@components/game-my-status.vue';
import GameTiles from '@components/game-tiles.vue';
import GameDialog from '@components/game-dialog.vue';
import GameActions from '@components/game-actions.vue';
import GameTileDetail from '@components/game-tile-detail.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  inject: ['auth', 'room', 'game', 'map'],
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NLayoutContent,
    Players,
    GameMyStatus,
    GameTiles,
    GameDialog,
    GameActions,
    GameTileDetail,
    Flexbox,
    Loader,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && game.isReady">
    <n-layout content-style="padding: 8px 8px;" class="game dark">
      <n-layout-header class="header dark">
        <game-my-status />
        <h2 class="round">Round {{ game.current.round }}</h2>
      </n-layout-header>

      <n-layout has-sider>
        <n-layout-sider width="120" content-style="padding-right: 4px;" class="players dark">
          <players :list="room.current.players" />
        </n-layout-sider>

        <n-layout-content class="dark">
          <flexbox class="align-items-start">
            <game-tiles class="flex-1" @selected="tile => map.onSelect(tile)" />
            <flexbox column class="align-items-end">
              <game-tile-detail :data="map.selected" />
              <game-actions />
            </flexbox>
          </flexbox>
          <game-dialog />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </section>
  <flexbox v-else fullscreen><loader /></flexbox>
</template>

<style lang="scss" scoped>
.dark {
  --color: #222 !important;
}
.game {
  height: calc(100vh - 30px);
  position: relative;
}
.round {
  font-size: 24px;
  color: #fff;
  display: flex;
  align-items: center;
  height: 32px;
  margin: 0;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  &::before,
  &::after {
    background: #666;
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
.players {
  color: #222;
}
</style>