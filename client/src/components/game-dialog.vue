<script>
import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['game'],
  components: {
    Flexbox,
  },
  computed: {
    visible() {
      const { isPray, isExchange, isCast, isConfirm } = this.game.status;
      return isPray || isExchange || isCast || isConfirm;
    },
  },
}
</script>

<template>
  <Flexbox v-if="visible" fullscreen class="dialog">
    <div v-if="game.status.isPray && !game.status.isCollected">
      <h3>Pray</h3>
      <button
        type="button"
        class="btn"
        @click="game.action.onCollect"
      >
        Collect
      </button>
    </div>

    <div v-if="game.status.isExchange && game.action.isMine">
      <h3>Exchange</h3>
      <button
        type="button"
        class="btn"
        @click="game.action.onAccept"
      >
        Accept
      </button>
      <button
        type="button"
        class="btn"
        @click="game.action.onCancel"
      >
        Cancel
      </button>
    </div>

    <div v-if="game.status.isExchange && !game.action.isMine">
      <h3>Ask For Exchange</h3>
    </div>

    <div v-if="game.status.isCast && game.action.isMine">
      <h3>Cast A Spell</h3>
      <button
        type="button"
        class="btn"
        @click="game.action.onCasting"
      >
        Cast
      </button>
      <button
        type="button"
        class="btn"
        @click="game.action.onCancel"
      >
        Cancel
      </button>
    </div>

    <div v-if="game.status.isConfirm && !game.status.isConfirmed">
      <h3>Current Status</h3>
      <button
        type="button"
        class="btn"
        @click="game.action.onConfirm"
      >
        Confirm
      </button>
    </div>
  </Flexbox>
</template>

<style lang="scss" scoped>
.dialog {
  background-color: rgba(0, 0, 0, .5);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
}
</style>