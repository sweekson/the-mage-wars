<script>
export default {
  inject: ['room', 'game'],
}
</script>

<template>
  <section>
    <button
      :disabled="!game.action.isPrayable"
      class="btn btn-block"
      type="button"
      @click="game.action.onPray"
    >
      Pray
    </button>

    <button
      :disabled="!game.action.isExchangeable"
      class="btn btn-block"
      type="button"
      @click="game.action.onExchange"
    >
      Exchange
    </button>

    <button
      :disabled="!game.action.isCastable"
      class="btn btn-block"
      type="button"
      @click="game.action.onCast"
    >
      Cast Spells ({{ game.me.actions }})
    </button>

    <button
      :disabled="!game.action.isPassable"
      class="btn btn-block"
      type="button"
      @click="game.action.onPass"
    >
      Pass
    </button>

    <button
      class="btn btn-block"
      type="button"
      @click="room.onLeave"
    >
      Leave
    </button>
  </section>
</template>