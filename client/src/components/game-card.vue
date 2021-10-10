<script>
import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    Flexbox,
    GameIcon,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
    },
  },
};
</script>

<template>
  <div :class="['game-card', { 'game-card-selected': selected }]">
    <div class="game-card-icon">
      <flexbox>
        <game-icon
          :name="data.icon"
          :color="data.color"
          :size="'5xl'"
        />
      </flexbox>
    </div>

    <div class="game-card-name">
      {{ data.name }}
    </div>

    <div class="game-card-description">
      {{ data.description }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-card {
  background-color: $color-dusk-400;
  border: 2px solid $color-mist-200;
  border-radius: 4px;
  cursor: pointer;
  width: 180px;
  padding: 16px;

  &:not(.game-card-selected):hover {
    border-color: $color-mist-300;
  }

  &-name {
    font-size: 16px;
    font-weight: 300;
    line-height: 1;
    text-align: center;
    color: #ccc;
    user-select: none;
    padding: 12px 0;
  }

  &-description {
    font-size: 14px;
    font-weight: 200;
    line-height: 1.5;
    color: #999;
    overflow: auto;
    user-select: none;
    height: calc(14px * 1.5 * 3);
  }
}
</style>
