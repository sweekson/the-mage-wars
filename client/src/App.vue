<script>
import { reactive, provide } from 'vue';
import { useRouter } from 'vue-router';
import { NConfigProvider, NGlobalStyle, NMessageProvider, darkTheme } from 'naive-ui';

import Navbar from '@components/navbar.vue';
import Logs from '@components/logs.vue';
import { useEnv } from '@composables/use-env';
import { useLogger } from '@composables/use-logger';
import { useFeathers } from '@composables/use-feathers';
import { useAuth } from '@composables/use-auth';
import { useRoom } from '@composables/use-room';
import { useGame } from '@composables/use-game';
import { useGameMap } from '@composables/use-game-map';

export default {
  name: 'App',
  components: {
    NConfigProvider,
    NGlobalStyle,
    NMessageProvider,
    Navbar,
    Logs,
  },
  setup() {
    const env = useEnv();
    const logger = reactive(useLogger());
    const router = useRouter();
    const { client } = useFeathers({ host: env.get('SOCKET_HOST') });
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
    auth.on('unauthenticated', () => {
      if (['#/signup', '#/login'].includes(location.hash)) return;
      router.push('/');
    });
    room.on('joined', () => router.push('/room'));
    room.on('started', () => router.push('/game'));
    room.on('left', () => router.push('/lobby'));
    game.on('ready', () => router.push('/game'));

    return {
      auth,
      theme: darkTheme,
    };
  },
};
</script>

<template>
  <n-config-provider :theme="theme" class="provider">
    <n-global-style />
    <n-message-provider>
      <router-view v-if="!auth.isLoggedIn" />
      <navbar v-if="auth.isLoggedIn" />
      <main v-if="auth.isLoggedIn" class="flexbox">
        <router-view class="flex-1" />
        <logs />
      </main>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.provider{
  height: 100%;
}
main {
  height: calc(100% - 30px);
}
</style>