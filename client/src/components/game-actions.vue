<script>
import { inject, onMounted, onUnmounted } from 'vue';
import { NModal, NDialog, useMessage } from 'naive-ui';

export default {
  components: {
    NModal,
    NDialog,
  },
  inject: ['room', 'game'],
  setup() {
    const game = inject('game');
    const message = useMessage();
    const onRotated = () => message.info('Your turn');
    const onAttacked = ({ detail }) => {
      message.info(`Your attack caused ${detail.attacked} damage to the target`);
    };
    const onHealed = ({ detail }) => {
      message.info(`The energy of your camp has recovered by ${detail.energy}`);
    };
    const onAffected = () => message.info('You have got an unknown buff');

    onMounted(() => {
      game.on('rotated', onRotated);
      game.on('attacked', onAttacked);
      game.on('healed', onHealed);
      game.on('affected', onAffected);
    });

    onUnmounted(() => {
      game.off('rotated', onRotated);
      game.off('attacked', onAttacked);
      game.off('healed', onHealed);
      game.off('affected', onAffected);
    });
  },
};
</script>

<template>
  <section>
    <button
      :disabled="!game.action.isPrayable || game.status.isCollect"
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      data-text="Roll Dice"
      @click="game.action.onPray"
    />

    <button
      :disabled="!game.action.isExchangeable"
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      :data-text="`Exchange (${game.me.exchanges})`"
      @click="game.exchange.onOpen"
    />

    <button
      :disabled="!game.action.isCastable"
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      :data-text="`Spells (${game.me.actions})`"
      @click="game.cast.onOpen"
    />

    <button
      :disabled="!game.action.isMoveable"
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      data-text="Move"
      @click="game.action.onMove"
    />

    <button
      :disabled="!game.action.isPassable"
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      data-text="Pass"
      @click="game.action.onTryPass"
    />

    <button
      class="btn btn-lg btn-block btn-skew btn-mist"
      type="button"
      data-text="Leave"
      @click="room.isLeaving = true"
    />

    <n-modal :show="game.action.isPassing">
      <n-dialog
        type="warning"
        title="Confirmation"
        :content="`You still have ${game.me.actions} action(s) to perform. Are you sure you want to skip?`"
        positive-text="Pass"
        negative-text="Cancel"
        :show-icon="false"
        @positive-click="game.action.onPass"
        @negative-click="game.action.isPassing = false"
        @close="game.action.isPassing = false"
      />
    </n-modal>

    <n-modal :show="room.isLeaving">
      <n-dialog
        type="warning"
        title="Confirmation"
        content="You will not be able to join again until the game is over. Are you sure?"
        positive-text="Leave"
        negative-text="Stay"
        :show-icon="false"
        @positive-click="room.onLeave(), game.action.onLeave()"
        @negative-click="room.isLeaving = false"
        @close="room.isLeaving = false"
      />
    </n-modal>
  </section>
</template>
