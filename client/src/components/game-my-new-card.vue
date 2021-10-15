<script>
import { NButton } from 'naive-ui';

import Flexbox from '@components/flexbox.vue';
import GameCard from '@components/game-card.vue';

export default {
  components: {
    NButton,
    Flexbox,
    GameCard,
  },
  inject: ['game'],
};
</script>

<template>
  <div>
    <game-card
      :data="game.cast.casted"
      selected
      class="my-new-card"
    />

    <flexbox style="padding: 32px 0;">
      <n-button
        type="primary"
        size="large"
        class="confirm-button"
        @click="game.cast.onCastedConfirm"
      >
        Confirm
      </n-button>
    </flexbox>
  </div>
</template>

<style lang="scss" scoped>
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes rotate {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.my-new-card {
  animation: fadein .1s linear, rotate .3s linear 2;
}
.confirm-button {
  animation: fadein .3s linear;
}
</style>
