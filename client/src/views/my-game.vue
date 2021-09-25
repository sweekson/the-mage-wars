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
  <section v-if="auth.isLoggedIn && room.isJoined && game.isReady">
    <h2>My Game ({{ game.current.round }})</h2>
    <GameMyStatus />
    <div class="flexbox">
      <Players :list="room.current.players" class="flex-1" />
      <GameTiles />
      <GameDialog class="flex-2" />
      <GameActions />
    </div>
  </section>
  <Flexbox v-else fullscreen><Loader /></Flexbox>
</template>