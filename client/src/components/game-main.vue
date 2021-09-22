<script>
export default {
  inject: ['game'],
}
</script>

<template>
  <section>
    <div v-if="game.status.isPray && !game.status.isCollected">
      <h3>Pray</h3>
      <button
        type="button"
        @click="game.action.onCollect"
      >
        Collect
      </button>
    </div>

    <div v-if="game.status.isExchange && game.action.isMine">
      <h3>Exchange</h3>
      <button
        type="button"
        @click="game.action.onAccept"
      >
        Accept
      </button>
      <button
        type="button"
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
        @click="game.action.onCasting"
      >
        Cast
      </button>
      <button
        type="button"
        @click="game.action.onCancel"
      >
        Cancel
      </button>
    </div>

    <div v-if="game.status.isConfirm && !game.status.isConfirmed">
      <h3>Current Status</h3>
      <button
        type="button"
        @click="game.action.onConfirm"
      >
        Confirm
      </button>
    </div>
  </section>
</template>