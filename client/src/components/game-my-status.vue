<script>
import { NGrid, NGridItem, NStatistic } from 'naive-ui';

import Hexagon from '@components/hexagon';

export default {
  inject: ['game'],
  components: {
    NGrid,
    NGridItem,
    NStatistic,
    Hexagon,
  },
}
</script>

<template>
  <n-grid cols="3 480:8 600:10 720:12" :x-gap="4">
    <n-grid-item>
      <hexagon height="60">
        <span class="team">{{ game.me.team }}</span>
      </hexagon>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Strengths">{{ game.me.strength }}</n-statistic>
    </n-grid-item>

    <n-grid-item>
      <n-statistic label="Defense">{{ game.me.defense }}</n-statistic>
    </n-grid-item>
  </n-grid>
</template>

<style lang="scss" scoped>
.team {
  font-size: 40px;
  font-weight: 300;
}
</style>