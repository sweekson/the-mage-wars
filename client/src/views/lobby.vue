<script>
import {
  NLayout, NLayoutHeader, NLayoutSider, NLayoutContent,
  NSpace, NInputGroup, NInput, NButton,
} from 'naive-ui';

import Rooms from '@components/rooms';
import Players from '@components/players';
import Flexbox from '@components/flexbox';
import Loader from '@components/loader';

export default {
  inject: ['auth', 'room'],
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NLayoutContent,
    NSpace,
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
    <n-layout content-style="padding: 8px;" class="transparent">
      <n-layout-header class="header transparent">
        <h2 v-html="$t('game.lobby')"></h2>
      </n-layout-header>

      <n-layout has-sider sider-placement="right" class="transparent">
        <n-layout-content content-style="padding-right: 8px;" class="transparent">
          <h3>Rooms</h3>
          <flexbox v-if="!room.rooms.length" class="panel panel-empty empty-rooms">
            No rooms have been created
          </flexbox>
          <rooms />

          <h3>Online Players</h3>
          <players :list="room.players" />
        </n-layout-content>

        <n-layout-sider :width="240" class="transparent">
          <form class="flexbox panel panel-ghost">
            <n-space vertical style="width: 100%;">
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
        </n-layout-sider>
      </n-layout>
    </n-layout>
  </section>
  <flexbox v-else fullscreen><loader /></flexbox>
</template>

<style lang="scss" scoped>
.transparent {
  --color: transparent !important;
}
.empty-rooms {
  width: 300px;
  height: 100px;
}
</style>
