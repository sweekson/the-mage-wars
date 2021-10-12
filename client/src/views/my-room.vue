<script>
import { NButton } from 'naive-ui';

import Players from '@components/players.vue';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';
import GameCountdown from '@components/game-countdown';

export default {
  components: {
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
  <section
    v-if="auth.isLoggedIn && room.isJoined && !game.isReady"
    class="centered-container-small backdrop-bluish"
    style="padding: 16px;"
  >
    <h2 class="game-room-title">
      {{ room.current.name }}
    </h2>

    <flexbox gap="4px">
      <n-button
        v-if="room.isAdmin"
        type="primary"
        size="large"
        ghost
        :disabled="!room.status.isReady || room.status.isStarting"
        class="flex-3"
        @click="room.onStart"
      >
        {{ $t('common.start') }}
      </n-button>

      <n-button
        type="warning"
        size="large"
        ghost
        :disabled="room.status.isStarting"
        class="flex-1"
        @click="room.onLeave"
      >
        {{ $t('common.leave') }}
      </n-button>
    </flexbox>

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

<style lang="scss" scoped>
.game-room-title {
  font-size: 48px;
  font-weight: 200;
  line-height: 1;
  text-align: center;
  margin-bottom: 16px;
}
</style>
