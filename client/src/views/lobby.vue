<script>
import BadRequest from '../errors/bad-request.vue';

export default {
  inject: ['auth', 'room'],
  components: {
    BadRequest,
  },
}
</script>

<template>
  <section v-if="auth.isLoggedIn && room.isLoaded && !room.isJoined">
    <h2>Lobby</h2>
    <form class="flexbox">
      <input v-model="room.name" type="text" class="flex-1" />
      <button type="button" @click="room.onCreate">Create</button>
    </form>
    <div
      v-for="item in room.rooms"
      :key="item.id"
      class="flexbox"
    >
      <span class="flex-1">{{ item.name }} ({{ item.admin.name }}) ({{ item.status }}) ({{ item.players.length }}) </span>
      <button v-if="item.isOpen" type="button" @click="room.onJoin(item.id)">Join</button>
    </div>
  </section>
  <BadRequest v-else />
</template>