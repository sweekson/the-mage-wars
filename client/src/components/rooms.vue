<script>
import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['room'],
  components: {
    Flexbox,
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
        <button
          :disabled="!item.isOpen"
          class="btn"
          type="button"
          @click="room.onJoin(item.id)"
        >
          Join
        </button>
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
  background-color: #e9e9e9;
  border: 1px solid #999;
  border-radius: 2px;
  flex: 0 0 calc(50% - 2px);
  flex-wrap: wrap;

  &:hover {
    background-color: #f9f9f9;
  }
}
.room-heading {
  width: 100%;
  height: 20px;
}
.room-title {
  font-weight: 500;
  padding: 4px 8px;
}
.room-toolbar {
  font-size: 14px;
  color: #666;
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