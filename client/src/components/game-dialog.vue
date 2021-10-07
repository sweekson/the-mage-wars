<script>
import { NDialog } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameDices from '@components/game-dices.vue';
import GameExchangeRequester from '@components/game-exchange-requester.vue';
import GameExchangeResponder from '@components/game-exchange-responder.vue';
import GameCastSpell from '@components/game-cast-spell.vue';
import GameCampStatus from '@components/game-camp-status.vue';

export default {
  components: {
    NDialog,
    Flexbox,
    GameDices,
    GameExchangeRequester,
    GameExchangeResponder,
    GameCastSpell,
    GameCampStatus,
  },
  inject: ['game'],
  computed: {
    visible() {
      const {
        isPray,
        isCollect,
        isCollected,
        isExchange,
        isCast,
        isConfirm,
      } = this.game.status;
      const { isMine } = this.game.action;
      if (isCollect && isCollected) return false;
      return isPray || isCollect || isExchange || (isCast && isMine) || isConfirm;
    },
  },
};
</script>

<template>
  <flexbox
    v-if="visible"
    fullscreen
    class="dialog"
  >
    <game-dices v-if="(game.status.isPray || game.status.isCollect) && !game.status.isCollected" />

    <n-dialog
      v-if="game.status.isExchange && game.action.isMine"
      title="Exchange"
      positive-text="Confirm"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onAccept"
      @negative-click="game.action.onCancel"
    >
      <game-exchange-requester />
    </n-dialog>

    <n-dialog
      v-if="game.status.isExchange && !game.action.isMine"
      title="Ask For Exchange"
      positive-text="Confirm"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
    >
      <game-exchange-responder />
    </n-dialog>

    <n-dialog
      v-if="game.status.isCast && game.action.isMine"
      title="Cast Spells"
      positive-text="Cast"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onCasting"
      @negative-click="game.action.onCancel"
    >
      <game-cast-spell />
    </n-dialog>

    <n-dialog
      v-if="game.status.isConfirm && !game.status.isConfirmed"
      type="success"
      title="Current Status"
      positive-text="Confirm"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onConfirm"
    >
      <game-camp-status />
    </n-dialog>
  </flexbox>
</template>

<style lang="scss" scoped>
.dialog {
  background-color: rgba(0, 0, 0, .5);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}
</style>
