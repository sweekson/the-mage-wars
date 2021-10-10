<script>
import { inject } from 'vue';
import { NDialog, useMessage } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import NumberDice from '@components/number-dice.vue';
import GameDices from '@components/game-dices.vue';
import GameExchangeRequester from '@components/game-exchange-requester.vue';
import GameExchangeResponder from '@components/game-exchange-responder.vue';
import GameCastSpell from '@components/game-cast-spell.vue';
import GameCampStatus from '@components/game-camp-status.vue';
import GameMyNewCard from '@components/game-my-new-card.vue';
import GamePeekedResult from '@components/game-peeked-result.vue';

export default {
  components: {
    NDialog,
    Flexbox,
    NumberDice,
    GameDices,
    GameExchangeRequester,
    GameExchangeResponder,
    GameCastSpell,
    GameCampStatus,
    GameMyNewCard,
    GamePeekedResult,
  },
  inject: ['game'],
  setup() {
    const { status, exchange, cast } = inject('game');
    const message = useMessage();
    const onTrySend = () => {
      if (exchange.isSendable) return exchange.onSend();
      message.error('The numbers of elements have not been set');
    };
    const onTryAccept = () => {
      if (exchange.isAcceptable) return exchange.onAccept();
      message.error('No player is selected');
    };
    const onExchangeConfirm = () => {
      !status.isExchange ? onTrySend() : onTryAccept();
    };
    const onExchangeReply = () => {
      if (exchange.isSendable) return exchange.onReply();
      message.error('The numbers of elements have not been set');
    };
    const onSpellCast = () => {
      if (cast.isSendable) return cast.onSend();
      if (!cast.selected) return message.error('No spell is selected');
      message.error('Insufficient number of elements');
    };

    return {
      onExchangeConfirm,
      onExchangeReply,
      onSpellCast,
    };
  },
  computed: {
    visible() {
      const {
        isPray,
        isCollect,
        isCollected,
        isExchange,
        isMove,
        isConfirm,
      } = this.game.status;
      const { isMine } = this.game.action;
      const { exchange, cast } = this.game;

      if (isCollect && isCollected) return false;

      return (
        isPray || isCollect ||
        (exchange.isOpen && isMine) || isExchange ||
        (cast.isOpen && isMine) || cast.isCasted || cast.isPeeked ||
        isMove || isConfirm
      );
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
    <game-my-new-card v-if="game.cast.isCasted" />
    <game-peeked-result v-if="game.cast.isPeeked" />

    <number-dice
      v-if="game.status.isMove"
      :value="game.current.action.moves"
    />

    <n-dialog
      v-if="game.exchange.isOpen && game.action.isMine"
      title="Exchange"
      :positive-text="game.status.isExchange ? 'Confirm' : 'Send Request'"
      :negative-text="'Cancel'"
      :closable="false"
      :show-icon="false"
      @positive-click="onExchangeConfirm"
      @negative-click="game.exchange.onReject"
    >
      <game-exchange-requester />
    </n-dialog>

    <n-dialog
      v-if="game.status.isExchange && !game.action.isMine"
      :title="`${game.exchange.requester.name}'s Exchange Request`"
      :positive-text="game.exchange.isReplied ? null : 'Confirm'"
      :negative-text="game.exchange.isReplied ? 'Cancel' : null"
      :closable="false"
      :show-icon="false"
      @positive-click="onExchangeReply"
      @negative-click="game.exchange.onRegret"
    >
      <game-exchange-responder />
    </n-dialog>

    <n-dialog
      v-if="game.cast.isOpen && game.action.isMine"
      title="Cast Spells"
      positive-text="Cast"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
      @positive-click="onSpellCast"
      @negative-click="game.cast.onCancel"
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
  z-index: 700;
}
</style>
