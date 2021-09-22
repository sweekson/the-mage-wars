<script>
import Players from '@components/players.vue';
import GameMain from '@components/game-main.vue';
import GameActions from '@components/game-actions.vue';
import BadRequest from '../errors/bad-request.vue';

export default {
  inject: ['auth', 'room', 'game'],
  components: {
    Players,
    GameMain,
    GameActions,
    BadRequest,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && game.isReady">
    <h2>My Game ({{ game.current.round }})</h2>
    <div class="flexbox">
      <Players :list="room.current.players" class="flex-1" />
      <GameMain class="flex-2" />
      <GameActions />
    </div>
  </section>
  <BadRequest v-else />
</template>