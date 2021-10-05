<script>
import { NSpace, NButton } from 'naive-ui';

import Players from '@components/players.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';
import GameCountdown from '@components/game-countdown';

export default {
  components: {
    NSpace,
    NButton,
    Players,
    Flexbox,
    Loader,
    GameCountdown,
  },
  inject: ['auth', 'room', 'game'],
};
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isJoined && !game.isReady">
    <h2>{{ room.current.name }}</h2>
    <n-space>
      <n-button
        v-if="room.isAdmin"
        type="primary"
        :disabled="!room.status.isReady || room.status.isStarting"
        @click="room.onStart"
      >
        {{ $t('common.start') }}
      </n-button>

      <n-button
        type="warning"
        :disabled="room.status.isStarting"
        @click="room.onLeave"
      >
        {{ $t('common.leave') }}
      </n-button>
    </n-space>
    <h3>Players</h3>
    <players :list="room.current.players" />
    <game-countdown />
  </section>
  <flexbox
    v-else
    fullscreen
  >
    <loader />
  </flexbox>
</template>
