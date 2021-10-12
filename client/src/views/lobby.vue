<script>
import {
  NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NSpace, NInput, NButton,
} from 'naive-ui';

import Rooms from '@components/rooms';
import Players from '@components/players';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NLayoutContent,
    NSpace,
    NInput,
    NButton,
    Rooms,
    Players,
    Flexbox,
    Loader,
  },
  inject: ['auth', 'room'],
};
</script>

<template>
  <section
    v-if="auth.isLoggedIn && room.isLoaded && !room.isJoined"
    class="centered-container stretched-container backdrop-bluish"
  >
    <n-layout
      has-sider
      sider-placement="right"
      content-style="padding: 16px;"
      class="stretched-container n-layout-transparent"
    >
      <n-layout
        class="n-layout-transparent"
      >
        <n-layout-header class="n-layout-transparent">
          <h2>{{ $t('game.lobby') }}</h2>
        </n-layout-header>

        <n-layout-content
          content-style="padding-right: 8px;"
          class="n-layout-transparent"
        >
          <h3>Rooms</h3>

          <flexbox
            v-if="!room.rooms.length"
            class="empty-rooms panel panel-ghost"
          >
            No rooms have been created
          </flexbox>

          <rooms />
        </n-layout-content>
      </n-layout>

      <n-layout-sider
        :width="200"
        class="n-layout-transparent"
      >
        <flexbox
          column
          full
          style="align-items: stretch;"
        >
          <form class="flexbox panel panel-ghost">
            <n-space
              vertical
              style="width: 100%;"
            >
              <h3>Create Room</h3>

              <n-input
                v-model:value="room.name"
                type="text"
                placeholder="Enter room title"
                size="large"
                class="flex-1"
              />
              <n-button
                :disabled="!room.name"
                size="large"
                block
                @click="room.onCreate"
              >
                {{ $t('game.create') }}
              </n-button>
            </n-space>
          </form>

          <h3>Online Players</h3>
          <players
            :list="room.players"
            class="flex-1"
            style="overflow: auto;"
          />
        </flexbox>
      </n-layout-sider>
    </n-layout>
  </section>
  <flexbox
    v-else
    fullscreen
  >
    <loader />
  </flexbox>
</template>

<style lang="scss" scoped>
.empty-rooms {
  width: 50%;
  padding: 24px 8px;
}
</style>
