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
        :class="['tile', 'tile' + tile.type]"
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
  border: 1px solid #666;
  display: flex;
  flex-direction: column;
  width: 72px;
  height: 72px;
}
.elems {
  justify-content: space-between;
  padding: 0 4px;
}
.elem {
  display: flex;
  width: 29px;
  height: 35px;

  &::after {
    font-size: 40px;
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
  padding: 7px;
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