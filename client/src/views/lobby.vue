<script>
import { NGrid, NGridItem, NInputGroup, NInput, NButton } from 'naive-ui';

import Rooms from '@components/rooms';
import Players from '@components/players';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  inject: ['auth', 'room'],
  components: {
    NGrid,
    NGridItem,
    NInputGroup,
    NInput,
    NButton,
    Rooms,
    Players,
    Flexbox,
    Loader,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isLoaded && !room.isJoined">
    <h2 v-html="$t('game.lobby')"></h2>

    <h3>Rooms</h3>
    <form class="flexbox">
      <n-grid cols="2 1080:3 1440:4">
        <n-grid-item>
          <n-input-group>
            <n-input
              v-model:value="room.name"
              type="text"
              placeholder="Enter room title"
              class="flex-1"
            />
            <n-button
              :disabled="!room.name"
              @click="room.onCreate"
            >
              {{ $t('game.create') }}
            </n-button>
          </n-input-group>
        </n-grid-item>
      </n-grid>
    </form>
    <rooms />
    <h3>Online Players</h3>
    <players :list="room.players" />
  </section>
  <flexbox v-else fullscreen><loader /></flexbox>
</template>