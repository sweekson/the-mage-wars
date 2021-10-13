<script>
import { inject, computed } from 'vue';
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
  setup() {
    const { me, cast } = inject('game');
    const { team, name } = cast.peeked;
    const isSameCamp = computed(() => me.team === team);
    const target = computed(() => {
      return {
        icon: 'cowled',
        color: isSameCamp.value ? 'green' : 'volcano',
        level: 1,
        name,
        description: isSameCamp.value
          ? `${name} and you are in the same camp`
          : `${name} belongs to the opponent's camp`,
      };
    });
    return { target };
  },
};
</script>

<template>
  <div>
    <game-card
      :data="target"
      selected
      class="peeked-result"
    />

    <flexbox style="padding: 32px 0;">
      <n-button
        type="primary"
        size="large"
        class="confirm-button"
        @click="game.cast.onPeekedConfirm"
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

.peeked-result {
  animation: fadein .1s linear, rotate .3s linear 3;
}
.confirm-button {
  animation: fadein .3s linear;
}
</style>
