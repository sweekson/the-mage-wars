<script>
import Flexbox from '@components/flexbox.vue';

export default {
  inject: ['map'],
  components: {
    Flexbox,
  },
}
</script>

<template>
  <section class="map">
    <Flexbox class="tiles" :style="{ width: map.width }">
      <div
        v-for="(tile, index) in map.tiles"
        :key="index"
        :class="['tile', 'tile' + tile.type, 'tile' + tile.dir]"
        :style="{ order: tile.order }"
      >
        <Flexbox class="elems">
          <Flexbox
            center
            v-for="key in tile.occupied"
            :key="key"
            :class="['elem', 'elem' + key]"
          />
        </Flexbox>

        <Flexbox class="players">
          <div
            v-for="key in tile.players"
            :key="key"
            :class="['player', 'player' + key]"
          />
        </Flexbox>
      </div>
    </Flexbox>
  </section>
</template>

<style lang="scss" scoped>
.tiles {
  flex-wrap: wrap;
  gap: 5px;
}
.tile {
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  width: 72px;
  height: 72px;
  position: relative;
  z-index: 1;

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

  &1000 {
    &::before {
      width: 80%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &0200 {
    &::before {
      height: 80%;
      top: 10%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &0030 {
    &::before {
      width: 80%;
      top: 10%;
      left: 10%;
    }
    &::after {
      display: none;
    }
  }

  &0004 {
    &::before {
      height: 80%;
      top: 10%;
    }
    &::after {
      display: none;
    }
  }

  &1200 {
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

  &0230 {
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

  &0034 {
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

  &1004 {
    &::before {
      width: 80%;
      left: 10%;
    }
    &::after {
      height: 80%;
      top: 10%;
    }
  }

  &0204 {
    &::before {
      width: 100%;
      height: 80%;
      top: 10%;
    }
    &::after {
      display: none;
    }
  }

  &1030 {
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
  margin: 7px 8px 0;
}
.elem {
  display: flex;
  width: 29px;
  height: 28px;

  &::after {
    font-size: 32px;
    color: #999;
    display: inline-block;
  }

  @at-root .tile1 &::after {
    content: "\2660";
  }

  @at-root .tile2 &::after {
    content: "\2663";
  }

  @at-root .tile3 &::after {
    content: "\2666";
  }

  &1::after {
    color: #f00;
  }

  &2::after {
    color: #0f0;
  }

  &3::after {
    color: #00f;
  }
}
.players {
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px;
  margin: 4px 12px 11px;
}
.player {
  border-radius: 10px;
  width: 8px;
  height: 8px;

  &1 {
    background-color: #f00;
  }

  &2 {
    background-color: #0f0;
  }

  &3 {
    background-color: #00f;
  }
}
</style>