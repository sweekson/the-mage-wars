<script>
import Flexbox from '@components/flexbox.vue';
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    Flexbox,
    GameIcon,
  },
  inject: ['game'],
  props: {
    data: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
    },
    standalone: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selected'],
};
</script>

<template>
  <div
    :class="[
      'tile',
      'tile-' + size,
      'tile-' + data.shape,
      { standalone: standalone },
      { selected: !standalone && game.map.selected?.order === data.order },
    ]"
    :style="{ order: data.order }"
    @click="$emit('selected', data)"
    @focus="$emit('selected', data)"
  >
    <flexbox class="elems">
      <flexbox
        v-for="(color, index) in data.occupied"
        :key="index"
        center
        :class="['elem', `elem-${color}`]"
      >
        <game-icon
          :name="data.name"
          :color="color ? 'white' : data.color"
          :size="size ==='xl' ? 'md' : 'sm'"
          shape="circle"
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

@mixin generate-elem-colors($colors) {
  @each $color, $name in $colors {
    .elem-#{$name} { background-color: $color; }
  }
}

@mixin generate-player-colors($colors) {
  @each $color, $name in $colors {
    .player-#{$name} { background-color: $color; }
  }
}

.tile {
  --span: calc(var(--size) * 0.1);

  background-color: $color-dusk-100;
  border: 1px solid $color-mist-200;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  width: var(--size);
  height: var(--size);
  position: relative;
  z-index: 1;

  &:focus {
    outline: none;
  }

  &-sm {
    --size: 70px;
    --gap: 4px;
  }

  &-md {
    --size: 80px;
    --gap: 4px;
  }

  &-lg {
    --size: 90px;
    --gap: 6px;
  }

  &-xl {
    --size: 120px;
    --gap: 8px;
  }

  &:not(.standalone):hover {
    border-color: #ccc;
    cursor: pointer;
  }

  &.selected,
  &.selected:hover {
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
  margin: calc(var(--span) + var(--gap)) calc(var(--span) + var(--gap)) 0;
}
.elem {
  background-color: #fff;
  border-radius: 50%;
  box-shadow: inset 0 0 1px 1px $color-dusk-100;
  display: flex;
  width: calc(var(--size) * 0.5 - var(--span) * 2);
  height: calc(var(--size) * 0.5 - var(--span) * 2);

  @at-root .tile:not(.standalone) & {
    transition: .3s linear background-color;
  }

  &-0 {
    background-color: $color-mist-300;
  }
}
.players {
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1px calc(var(--span) * 0.5 - 0.5px);
  margin: var(--span) calc(var(--span) + var(--gap) - 1px) var(--span);
}
.player {
  box-shadow: 0 0 1px 1px #fff;
  border-radius: var(--span);
  width: var(--span);
  height: var(--span);
}

@include generate-elem-colors($player-colors);
@include generate-player-colors($player-colors);

</style>
