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
        @click="game.cast.onCastedConfirm"
      >
        Confirm
      </n-button>
    </flexbox>
  </div>
</template>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.my-new-card {
  animation: rotate .3s linear 3;
}
</style>
