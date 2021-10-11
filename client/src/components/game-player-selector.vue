<script>
import { NGrid, NGridItem } from 'naive-ui';
import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    NGrid,
    NGridItem,
    Flexbox,
    GameIcon,
  },
  inject: ['game'],
  props: {
    target: {
      type: String,
      required: true,
    },
    isSelfVisible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['select'],
  computed: {
    players() {
      const { current, me } = this.game;
      const others = current.players.filter(x => x.uid !== me.uid);
      if (!this.isSelfVisible) return others;
      return [Object.assign({}, me, { name: 'Me' }), ...others];
    },
    columns() {
      const length = this.players.length;
      if (length < 5) return length;
      return Math.ceil(length * .5);
    },
  },
};
</script>

<template>
  <div class="player-options">
    <n-grid
      :cols="columns"
      x-gap="8"
      y-gap="8"
      style="display: inline-grid; width: auto;"
    >
      <n-grid-item
        v-for="player in players"
        :key="player.uid"
        :class="[
          'player-option',
          { 'player-option-selected': player.uid === target },
        ]"
        @click="$emit('select', player.uid)"
      >
        <flexbox class="player-option-icon">
          <game-icon
            name="cowled"
            :color="player.uid === target ? 'berry' : 'silver'"
            size="3xl"
          />
        </flexbox>

        <div class="player-option-name">
          {{ player.name }}
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="scss" scoped>
.player-options {
  text-align: center;
}
.player-option {
  background-color: $color-dusk-100;
  border: 1px solid $color-dusk-200;
  border-radius: 4px;
  cursor: pointer;
  padding: 12px;

  &:hover,
  &-selected {
    border-color: #63e2b7;
  }

  &-name {
    font-weight: 300;
    line-height: 1;
    text-align: center;
    color: #ccc;
    user-select: none;
    padding-top: 12px;
  }
}
</style>
