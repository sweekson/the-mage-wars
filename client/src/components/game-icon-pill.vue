<script>
import TweenedNumber from '@components/tweened-number';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    TweenedNumber,
    GameIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'white',
    },
    amount: {
      type: Number,
      required: true,
    },
    warning: {
      type: Boolean,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    rounded: {
      type: Boolean,
    },
  },
};
</script>

<template>
  <div
    :class="[
      'game-icon-pill flexbox',
      { 'game-icon-pill-warning': warning },
      { 'game-icon-pill-bordered': bordered },
      { 'game-icon-pill-rounded': rounded },
    ]"
  >
    <game-icon
      :name="name"
      :color="color"
      :size="'sm'"
    />
    <tweened-number
      :value="amount"
      class="game-icon-pill-amount"
    />
  </div>
</template>

<style lang="scss" scoped>
.game-icon-pill {
  padding: 2px;

  &-bordered {
    background-color: $color-dusk-100;
    border: 1px solid $color-dusk-200;
    border-radius: 4px;
  }

  &-rounded {
    border-radius: 50px;
  }
}
.game-icon-pill-amount {
  color: #ccc;
  user-select: none;
  flex: 1;
  padding: 0 4px;

  @at-root .game-icon-pill-warning & {
    color: #f36;
  }
}
</style>
