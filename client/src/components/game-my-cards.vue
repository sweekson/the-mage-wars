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
  <div
    :class="[
      'my-card-table',
      { 'my-card-table-focus' : !!game.cards.selected },
    ]"
  >
    <flexbox
      v-if="game.cards.isCastable"
      class="my-card-action"
    >
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

.my-card-table {
  transition: background-color .3s;

  &-focus {
    background-color: $color-dusk-200;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 500;
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
.my-card-action {
  position: fixed;
  right: 0;
  bottom: 310px;
  left: 0;
}
.my-card {
  position: absolute;
  transition: transform;
  will-change: transform;

  &-selected {
    animation: selected .3s ease-in-out forwards;
  }
}
</style>
