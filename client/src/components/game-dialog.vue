<script>
import { NDialog } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['game'],
  components: {
    NDialog,
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
    <NDialog
      v-if="game.status.isPray && !game.status.isCollected"
      type="success"
      title="Pray"
      positive-text="Collect"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onCollect"
    />

    <NDialog
      v-if="game.status.isExchange && game.action.isMine"
      title="Exchange"
      positive-text="Accept"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onAccept"
      @negative-click="game.action.onCancel"
    />

    <NDialog
      v-if="game.status.isExchange && !game.action.isMine"
      title="Ask For Exchange"
      positive-text="Confirm"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
    />

    <NDialog
      v-if="game.status.isCast && game.action.isMine"
      title="Cast Spells"
      positive-text="Cast"
      negative-text="Cancel"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onCasting"
      @negative-click="game.action.onCancel"
    />

    <NDialog
      v-if="game.status.isConfirm && !game.status.isConfirmed"
      type="success"
      title="Current Status"
      positive-text="Confirm"
      :closable="false"
      :show-icon="false"
      @positive-click="game.action.onConfirm"
    />
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