<script>
import { NGrid, NGridItem, NEllipsis } from 'naive-ui';

export default {
  components: {
    NGrid,
    NGridItem,
    NEllipsis,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    highlight: {
      type: String,
      default: null,
    },
    colored: {
      type: Boolean,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<template>
  <section :class="['players', { 'players-colored': colored } ]">
    <n-grid
      cols="1 240:2 480:4 720:6 960:8 1200:10"
      :x-gap="4"
      :y-gap="4"
    >
      <n-grid-item
        v-for="player in list"
        :key="player.uid"
        :class="[
          'player',
          `player-depth-${depth}`,
          colored && `player-${player.color}`,
          { 'player-highlight': highlight === player.uid },
        ]"
      >
        <n-ellipsis :tooltip="false">
          {{ player.name }}
        </n-ellipsis>
      </n-grid-item>
    </n-grid>
  </section>
</template>

<style lang="scss" scoped>

@mixin generate-player-colors($colors) {
  @each $color, $name in $colors {
    .player-#{$name}::before { background-color: $color; }
  }
}

.player {
  border: 1px solid $color-dusk-300;
  border-radius: 2px;
  font-size: 14px;
  line-height: 24px;
  color: #eee;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 8px;

  @at-root .players-colored &::before {
    border-radius: 10px;
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
  }

  &-depth-1 {
    background-color: $color-dusk-200;
  }

  &-depth-2 {
    background-color: $color-dusk-100;
  }

  &-highlight {
    border-color: #63e2b7;
  }
}

@include generate-player-colors($player-colors);
</style>
