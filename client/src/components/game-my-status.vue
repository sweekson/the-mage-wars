<script>
import { NGrid, NGridItem, NStatistic } from 'naive-ui';

import Hexagon from '@components/hexagon';
import Flexbox from '@components/flexbox';

export default {
  inject: ['game'],
  components: {
    NGrid,
    NGridItem,
    NStatistic,
    Hexagon,
    Flexbox,
  },
}
</script>

<template>
  <n-grid cols="7 720:10 960:12 1200:14 1440:16" :x-gap="4">
    <n-grid-item>
      <hexagon height="60">
        <flexbox column>
          <h6 class="team-title">Camp</h6>
          <span class="team-number">{{ game.me.team }}</span>
        </flexbox>
      </hexagon>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Strength">{{ game.me.strength }}</n-statistic>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Defense">{{ game.me.defense }}</n-statistic>
    </n-grid-item>
  </n-grid>
</template>

<style lang="scss" scoped>
.team-title {
  font-size: 13px;
  font-weight: 500;
  color: #999;
}
.team-number {
  font-size: 32px;
  font-weight: 400;
  line-height: 32px;
}
</style>