<script>
import Flexbox from '@components/flexbox.vue';
import GameTile from '@components/game-tile.vue';

export default {
  components: {
    Flexbox,
    GameTile,
  },
  inject: ['game'],
  emits: ['selected'],
};
</script>

<template>
  <section style="margin: 0 4px;">
    <flexbox
      class="tiles"
      gap="5px"
      wrap
      :style="{ width: game.map.width }"
    >
      <game-tile
        v-for="(tile, index) in game.map.tiles"
        :key="tile.order"
        :data="tile"
        :tabindex="index + 1"
        @selected="$emit('selected', tile)"
      />
    </flexbox>
  </section>
</template>
