<script>
import { reactive } from 'vue';
import { NIcon, NGrid, NGridItem, NDivider } from 'naive-ui';
import KeyboardArrowDownOutlined from '@vicons/material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@vicons/material/KeyboardArrowUpOutlined';

import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';
import Players from '@components/players.vue';
import { draggable } from '@directives/draggable';
import { useCollapsible } from '@composables/use-collapsible';

export default {
  components: {
    NIcon,
    NGrid,
    NGridItem,
    NDivider,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    Flexbox,
    GameIcon,
    Players,
  },
  directives: {
    draggable,
  },
  inject: ['game'],
  props: {
    data: {
      type: Object,
      default: () => null,
    },
  },
  setup() {
    return {
      collapsible: reactive(useCollapsible({ value: true })),
    };
  },
};
</script>
<template>
  <div
    v-draggable="{ handle: '#tile-detail-title' }"
    :class="['tile-detail', { expanded: collapsible.expanded }]"
  >
    <h4
      id="tile-detail-title"
      class="tile-detail-title flexbox flexbox-center-y"
    >
      <span class="flex-1">Tile Detail</span>

      <n-icon
        size="20"
        color="#ccc"
        class="tile-detail-collapse-icon"
        @click="collapsible.toggle"
      >
        <keyboard-arrow-up-outlined v-if="collapsible.expanded" />
        <keyboard-arrow-down-outlined v-else />
      </n-icon>
    </h4>

    <flexbox
      v-if="!data"
      class="tile-detail-placeholder"
    >
      Select a tile to see the detail
    </flexbox>

    <div
      v-else
      class="tile-detail-content"
    >
      <n-grid
        cols="1"
        y-gap="8"
      >
        <n-grid-item
          v-for="(player, index) in data.occupied"
          :key="index"
        >
          <game-icon
            :name="data.name"
            :color="data.color"
            size="sm"
            shape="circle"
            bordered
            class="tile-type-icon"
          />
          <span v-if="player === 0">(Unoccupied)</span>
          <span v-else>{{ game.players.colors[player].name }}</span>
        </n-grid-item>
      </n-grid>

      <n-divider
        title-placement="center"
        class="tile-detail-divider"
      />

      <flexbox
        v-if="!data.players.length"
        class="tile-message"
      >
        No player is here
      </flexbox>

      <players
        v-else
        :list="game.players.toPlayers(data.players)"
        :depth="2"
        colored
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tile-detail {
  background-color: $color-dusk-300;
  border: 1px solid $color-dusk-200;
  border-radius: 2px;
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 400;

  @include media-breakpoint-down(xl) {
    transform: translate(calc(100vw - 208px), 360px);
  }

  @include media-breakpoint-up(xl) {
    transform: translate(calc(100vw - 450px), 118px);
  }

  &.expanded {
    height: 300px;
  }

  &-title {
    background-color: $color-dusk-200;
    border-radius: 2px;
    cursor: move;
    font-size: 15px;
    font-weight: 300;
    line-height: 1;
    user-select: none;
    height: 30px;
    padding: 8px;
  }
  &.expanded &-title {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  &-collapse-icon {
    cursor: default;
  }

  &-placeholder {
    font-weight: 100;
    color: #ccc;
    display: none;
    height: calc(100% - 32px);
  }
  &.expanded &-placeholder {
    display: flex;
  }

  &-content {
    display: none;
    padding: 8px;
  }
  &.expanded &-content {
    display: block;
  }
}
.tile-detail-content {
  font-size: 14px;
  font-weight: 100;
  line-height: 1;
  height: 270px;
  overflow: auto;
}
.tile-type-icon {
  margin-right: 8px;
}
.tile-detail-divider {
  --color: #{$color-mist-100} !important;
  margin: 8px 0;
}
.tile-message {
  color: #ccc;
  height: 160px;
}
</style>
