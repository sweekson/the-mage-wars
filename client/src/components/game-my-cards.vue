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
  <div class="my-card-table">
    <flexbox v-if="game.cards.isCastable">
      <n-button
        type="primary"
        size="large"
        @click="game.cards.onEnchant"
      >
        Enchant
      </n-button>
    </flexbox>

    <div
      class="my-cards"
      :style="{ width: `${(game.cards.list.length - 1) * 70 + 180}px` }"
    >
      <game-card
        v-for="(card, index) in game.cards.list"
        :key="index"
        :data="card"
        :selected="game.cards.selected === card"
        :style="{
          '--transform': card.position2,
          transform: card.position1,
        }"
        :class="['my-card', { 'my-card-selected' : game.cards.selected === card }]"
        @click="game.cards.onSelect(card)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes selected {
  100% {
    transform: var(--transform);
  }
}

.my-cards {
  height: 257px;
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 600;
}
.my-card {
  position: absolute;
  transition: transform;

  &-selected {
    animation: selected .3s ease-in-out forwards;
  }
}
</style>
