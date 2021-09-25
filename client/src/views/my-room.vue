<script>
import Players from '@components/players.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  inject: ['auth', 'room', 'game'],
  components: {
    Players,
    Flexbox,
    Loader,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && !game.isReady">
    <h2>{{ room.current.name }}</h2>
    <form>
      <button
        v-if="room.isAdmin"
        v-html="$t('common.start')"
        :disabled="!room.status.isReady || room.status.isStarting"
        class="btn"
        type="button"
        @click="room.onStart"
      >
      </button>
      <button
        v-html="$t('common.leave')"
        class="btn"
        type="button"
        :disabled="room.status.isStarting"
        @click="room.onLeave"
      />
    </form>
    <Players :list="room.current.players" />
  </section>
  <Flexbox v-else fullscreen><Loader /></Flexbox>
</template>