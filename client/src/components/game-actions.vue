<script>
import { NModal, NDialog } from 'naive-ui';

export default {
  inject: ['room', 'game'],
  components: {
    NModal,
    NDialog,
  },
}
</script>

<template>
  <section>
    <button
      :disabled="!game.action.isPrayable"
      class="btn btn-block btn-skew"
      type="button"
      data-text="Roll Dice"
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
      @click="room.isLeaving = true"
    />

    <n-modal :show="room.isLeaving">
      <n-dialog
        type="warning"
        title="Confirmation"
        content="You will not be able to join again until the game is over. Are you sure?"
        positive-text="Leave"
        negative-text="Stay"
        :show-icon="false"
        @positive-click="room.onLeave"
        @negative-click="room.isLeaving = false"
        @close="room.isLeaving = false"
      />
    </n-modal>
  </section>
</template>