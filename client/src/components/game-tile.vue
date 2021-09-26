<script>
import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';
import { TileIconColorMap } from '@composables/use-game-map';

export default {
  inject: ['map'],
  components: {
    Flexbox,
    GameIcon,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      TileIconColorMap,
    };
  },
}
</script>

<template>
  <div
    :class="[
      'tile',
      'tile-' + data.shape,
      { selected: map.selected?.order === data.order },
    ]"
    :style="{ order: data.order }"
    @click="$emit('selected', data)"
  >
    <flexbox class="elems">
      <flexbox
        center
        v-for="uid in data.occupied"
        :key="uid"
        :class="['elem']"
      >
        <game-icon
          :name="data.name"
          :color="TileIconColorMap[uid]"
          size="sm"
        />
      </flexbox>
    </flexbox>

    <flexbox class="players">
      <div
        v-for="uid in data.players"
        :key="uid"
        :class="['player', 'player-' + uid]"
      />
    </flexbox>
  </div>
</template>

<style lang="scss" scoped>

@mixin generate-player-colors($colors) {
  @each $color, $name in $colors {
    .player-#{$name} { background-color: $color; }
  }
}

$colors: (
  #f34: "1",
  #f73: "2",
  #fd4: "3",
  #9d1: "4",
  #4a2: "5",
  #1ce: "6",
  #37f: "7",
  #13e: "8",
  #a4f: "9",
  #f4c: "10",
);

.tile {
  border: 1px solid #666;
  display: flex;
  flex-direction: column;
  width: 72px;
  height: 72px;
  position: relative;
  z-index: 1;

  &:hover {
    border-color: #ccc;
  }

  &.selected {
    border-color: #ff0;
  }

  &::before,
  &::after {
    background-color: #ccc;
    content: "";
    display: inline-block;
    position: absolute;
    width: 90%;
    height: 90%;
    z-index: -1;
  }

  &-1000 {
    &::before {
      width: 80%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &-0200 {
    &::before {
      height: 80%;
      top: 10%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &-0030 {
    &::before {
      width: 80%;
      top: 10%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &-0004 {
    &::before {
      height: 80%;
      top: 10%;
    }
    &::after {
      display: none;
    }
  }

  &-1200 {
    &::before {
      width: 80%;
      left: 10%;
    }
    &::after {
      height: 80%;
      top: 10%;
      left: 10%;
    }
  }

  &-0230 {
    &::before {
      height: 80%;
      top: 10%;
      left: 10%;
    }
    &::after {
      width: 80%;
      top: 10%;
      left: 10%;
    }
  }

  &-0034 {
    &::before {
      height: 80%;
      top: 10%;
    }
    &::after {
      width: 80%;
      top: 10%;
      left: 10%;
    }
  }

  &-1004 {
    &::before {
      width: 80%;
      left: 10%;
    }
    &::after {
      height: 80%;
      top: 10%;
    }
  }

  &-0204 {
    &::before {
      width: 100%;
      height: 80%;
      top: 10%;
    }
    &::after {
      display: none;
    }
  }

  &-1030 {
    &::before {
      width: 80%;
      height: 100%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }
}
.elems {
  justify-content: space-between;
  margin: 11px 11px 0;
}
.elem {
  background-color: rgba(255, 255, 255, .6);
  box-shadow: 0 0 2px #666;
  border-radius: 22px;
  display: flex;
  width: 22px;
  height: 22px;
}
.players {
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1px 3px;
  margin: 6px 11px 8px;
}
.player {
  box-shadow: 0 0 1px 1px #fff;
  border-radius: 7px;
  width: 7px;
  height: 7px;
}

@include generate-player-colors($colors);

</style>