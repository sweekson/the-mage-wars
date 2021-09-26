<script>
import Players from '@components/players.vue';
import GameMyStatus from '@components/game-my-status.vue';
import GameTiles from '@components/game-tiles.vue';
import GameDialog from '@components/game-dialog.vue';
import GameActions from '@components/game-actions.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  inject: ['auth', 'room', 'game'],
  components: {
    Players,
    GameMyStatus,
    GameTiles,
    GameDialog,
    GameActions,
    Flexbox,
    Loader,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && game.isReady" class="game">
    <h2 class="round">Round {{ game.current.round }}</h2>
    <game-my-status />
    <flexbox class="align-items-start">
      <players :list="room.current.players" />
      <game-tiles class="flex-1" />
      <game-actions />
    </flexbox>
    <game-dialog />
  </section>
  <flexbox v-else fullscreen><loader /></flexbox>
</template>

<style lang="scss" scoped>
.game {
  position: relative;
}
.round {
  font-size: 24px;
  color: #fff;
  display: flex;
  align-items: center;
  height: 32px;
  position: absolute;
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
</style>