<script>
import { reactive } from 'vue';
import { NIcon } from 'naive-ui';
import KeyboardArrowDownOutlined from '@vicons/material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@vicons/material/KeyboardArrowUpOutlined';

import Flexbox from '@components/flexbox.vue';
import GameTile from '@components/game-tile.vue';
import { draggable } from '@directives/draggable';
import { useCollapsible } from '@composables/use-collapsible';

export default {
  components: {
    NIcon,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    Flexbox,
    GameTile,
  },
  directives: {
    draggable,
  },
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
    <h6
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
    </h6>

    <flexbox
      v-if="!data"
      class="tile-detail-placeholder"
    >
      Select a tile to see the detail
    </flexbox>

    <div class="tile-detail-content">
      <game-tile
        v-if="data"
        :data="data"
        size="lg"
        standalone
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tile-detail {
  background-color: $color-dusk-200;
  border: 1px solid $color-dusk-300;
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
    font-size: 14px;
    font-weight: 400;
    user-select: none;
    line-height: 16px;
    height: 32px;
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
    font-weight: 300;
    color: #999;
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
</style>
