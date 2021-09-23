<script>
import Players from '@components/players.vue';
import BadRequest from '../errors/bad-request.vue';

export default {
  inject: ['auth', 'room', 'game'],
  components: {
    Players,
    BadRequest,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && !game.isReady">
    <h2>{{ room.current.name }}</h2>
    <form>
      <button
        v-if="room.isAdmin"
        v-t="'common.start'"
        :disabled="!room.status.isReady || room.status.isStarting"
        type="button"
        @click="game.onStart"
      />
      <button
        v-t="'common.leave'"
        type="button"
        :disabled="room.status.isStarting"
        @click="room.onLeave"
      />
    </form>
    <Players :list="room.current.players" />
  </section>
  <BadRequest v-else />
</template>