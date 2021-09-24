<script>
import Rooms from '@components/rooms';
import Players from '@components/players';
import BadRequest from '../errors/bad-request.vue';

export default {
  inject: ['auth', 'room'],
  components: {
    Rooms,
    Players,
    BadRequest,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isLoaded && !room.isJoined">
    <h2 v-html="$t('game.lobby')"></h2>

    <h3>Rooms</h3>
    <form class="flexbox">
      <input v-model="room.name" type="text" class="flex-1" />
      <button
        v-html="$t('game.create')"
        class="btn"
        type="button"
        @click="room.onCreate"
      />
    </form>
    <Rooms />
    <h3>Online Players</h3>
    <Players :list="room.players" />
  </section>
  <BadRequest v-else />
</template>