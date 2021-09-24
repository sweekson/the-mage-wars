<script>
import { reactive, provide } from 'vue';
import { useRouter } from 'vue-router';

import Navbar from '@components/navbar.vue';
import Logs from '@components/logs.vue';
import { useLogger } from '@composables/use-logger';
import { useFeathers } from '@composables/use-feathers';
import { useAuth } from '@composables/use-auth';
import { useRoom } from '@composables/use-room';
import { useGame } from '@composables/use-game';
import { useGameMap } from '@composables/use-game-map';

export default {
  name: 'App',
  components: {
    Navbar,
    Logs,
  },
  setup() {
    const logger = reactive(useLogger());
    const router = useRouter();
    const { client } = useFeathers({ host: 'localhost:3030' });
    const auth = reactive(useAuth({ client, logger }));
    const room = reactive(useRoom({ client, logger, auth }));
    const game = reactive(useGame({ client, logger, auth, room }));
    const map = reactive(useGameMap({ client, logger, auth, room, game }));

    provide('logger', logger);
    provide('client', client);
    provide('auth', auth);
    provide('room', room);
    provide('game', game);
    provide('map', map);

    auth.on('login', () => router.push('/lobby'));
    auth.on('logout', () => router.push('/'));
    room.on('joined', () => router.push('/room'));
    room.on('started', () => router.push('/game'));
    room.on('left', () => router.push('/lobby'));
    game.on('ready', () => router.push('/game'));

    return {
      auth,
    };
  },
};
</script>

<template>
  <router-view v-if="!auth.isLoggedIn" />
  <Navbar v-if="auth.isLoggedIn" />
  <main v-if="auth.isLoggedIn" class="flexbox">
    <router-view class="content flex-1" />
    <Logs />
  </main>
</template>

<style scoped>
main {
  height: calc(100% - 30px);
}

.content {
  padding: 4px;
}
</style>