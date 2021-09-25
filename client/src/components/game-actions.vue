<script>
export default {
  inject: ['room', 'game'],
}
</script>

<template>
  <section>
    <button
      :disabled="!game.action.isPrayable"
      class="btn btn-block btn-skew"
      type="button"
      data-text="Pray"
      @click="game.action.onPray"
    />

    <button
      :disabled="!game.action.isExchangeable"
      class="btn btn-block btn-skew"
      type="button"
      data-text="Exchange"
      @click="game.action.onExchange"
    />

    <button
      :disabled="!game.action.isCastable"
      class="btn btn-block btn-skew"
      type="button"
      :data-text="`Cast Spells (${game.me.actions})`"
      @click="game.action.onCast"
    />

    <button
      :disabled="!game.action.isPassable"
      class="btn btn-block btn-skew"
      type="button"
      data-text="Pass"
      @click="game.action.onPass"
    />

    <button
      class="btn btn-block btn-skew"
      type="button"
      data-text="Leave"
      @click="room.onLeave"
    />
  </section>
</template>