<script>
import { NButton } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['room'],
  components: {
    Flexbox,
    NButton,
  },
}
</script>

<template>
  <flexbox class="rooms">
    <flexbox
      v-for="item in room.rooms"
      :key="item.id"
      class="room flexbox"
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
    </flexbox>
  </flexbox>
</template>

<style lang="scss" scoped>
.rooms {
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 4px;
}
.room {
  background-color: #555;
  border: 1px solid #ccc;
  border-radius: 2px;
  flex: 0 0 calc(50% - 2px);
  flex-wrap: wrap;

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