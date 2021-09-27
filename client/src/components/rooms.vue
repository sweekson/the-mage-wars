<script>
import { NGrid, NGridItem, NButton } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['room'],
  components: {
    Flexbox,
    NGrid,
    NGridItem,
    NButton,
  },
}
</script>

<template>
  <n-grid cols="1 480:2 720:3 960:4 1200:5 1440:6">
    <n-grid-item
      v-for="item in room.rooms"
      :key="item.id"
      class="room"
    >
      <header class="room-heading">
        <h4 class="room-title">{{ item.name }}</h4>
      </header>

      <flexbox class="room-toolbar">
        <span class="room-status">{{ item.status }}</span>
        <span class="room-players">{{ item.players.length }}</span>
        <span class="room-admin flex-1">{{ item.admin.name }}</span>
        <n-button
          size="tiny"
          :disabled="!item.isOpen"
          @click="room.onJoin(item.id)"
        >
          Join
        </n-button>
      </flexbox>
    </n-grid-item>
  </n-grid>
</template>

<style lang="scss" scoped>
.room {
  background-color: #555;
  border: 1px solid #ccc;
  border-radius: 2px;

  &:hover {
    border-color: #63e2b7;
  }
}
.room-heading {
  width: 100%;
  height: 20px;
}
.room-title {
  font-weight: 500;
  color: #fff;
  padding: 4px 8px;
}
.room-toolbar {
  font-size: 14px;
  color: #ccc;
  justify-content: flex-start;
  width: 100%;
  padding: 4px 8px;
}
.room-status:first-letter {
  text-transform: uppercase;
}
.room-players {
  padding: 0 4px;
}
</style>