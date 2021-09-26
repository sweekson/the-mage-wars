<script>
import Flexbox from '@components/flexbox.vue';
import GameTile from '@components/game-tile.vue';

export default {
  components: {
    Flexbox,
    GameTile,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>
<template>
  <div class="tile-detail">
    <flexbox v-if="!data" class="tile-detail-placeholder">
      Select a tile to see the detail
    </flexbox>

    <game-tile
      v-if="data"
      :data="data"
      size="lg"
      standalone
    />

    <div class="tile-detail-info">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.tile-detail {
  background-color: #444;
  width: 288px;
  height: 144px;
  margin-bottom: 8px;

  &-placeholder {
    font-weight: 300;
    color: #999;
    height: 100%;
  }
}
</style>