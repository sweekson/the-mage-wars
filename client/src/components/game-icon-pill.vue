<script>
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
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
      type: String,
      required: true,
    },
    rounded: {
      type: Boolean,
    },
  },
}
</script>

<template>
  <div :class="[
      'game-icon-pill flexbox',
      { 'game-icon-pill-rounded': rounded },
    ]"
  >
    <game-icon
      :name="name"
      :color="color"
      :size="'sm'"
    />
    <span class="game-icon-pill-amount">{{ amount }}</span>
  </div>
</template>

<style lang="scss" scoped>
.game-icon-pill {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  padding: 2px;

  &-rounded {
    border-radius: 50px;
  }
}
.game-icon-pill-amount {
  color: #ccc;
  user-select: none;
  flex: 1;
  padding: 0 4px;
}
</style>