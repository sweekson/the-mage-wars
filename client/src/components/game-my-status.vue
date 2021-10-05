<script>
import { NGrid, NGridItem, NStatistic } from 'naive-ui';

import Hexagon from '@components/hexagon';
import Flexbox from '@components/flexbox';
import GameMyElems from '@components/game-my-elems';

export default {
  inject: ['game'],
  components: {
    NGrid,
    NGridItem,
    NStatistic,
    Hexagon,
    Flexbox,
    GameMyElems,
  },
}
</script>

<template>
  <n-grid cols="10 960:12 1200:16" x-gap="8" item-responsive>
    <n-grid-item>
      <hexagon height="60" color="#eee">
        <flexbox column>
          <h6 class="camp-title">Camp</h6>
          <span class="camp-number">{{ game.me.team }}</span>
        </flexbox>
      </hexagon>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Strength">{{ game.me.strength }}</n-statistic>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Defense">{{ game.me.defense }}</n-statistic>
    </n-grid-item>

    <n-grid-item offset="3 960:5 1200:9" span="4">
      <game-my-elems />
    </n-grid-item>
  </n-grid>
</template>

<style lang="scss" scoped>
.camp-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1em;
  color: #444;
}
.camp-number {
  font-size: 32px;
  font-weight: 400;
  line-height: 1em;
  color: #222;
}
</style>