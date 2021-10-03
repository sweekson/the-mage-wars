<script>
import Flexbox from '@components/flexbox.vue';
import GameTile from '@components/game-tile.vue';

export default {
  inject: ['map'],
  components: {
    Flexbox,
    GameTile,
  },
}
</script>

<template>
  <section class="map">
    <flexbox class="tiles" :style="{ width: map.width }">
      <game-tile
        v-for="(tile, index) in map.tiles"
        :key="tile.order"
        :data="tile"
        :tabindex="index + 1"
        @selected="$emit('selected', tile)"
      />
    </flexbox>
  </section>
</template>

<style lang="scss" scoped>
.map {
  margin: 0 4px;
}
.tiles {
  flex-wrap: wrap;
  gap: 5px;
}
</style>