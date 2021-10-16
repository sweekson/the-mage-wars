<script>
import { NProgress } from 'naive-ui';

import GameCampBanner from '@components/game-camp-banner.vue';

export default {
  components: {
    NProgress,
    GameCampBanner,
  },
  props: {
    number: {
      type: String,
      required: true,
    },
    energy: {
      type: Number,
      required: true,
    },
  },
};
</script>

<template>
  <h4 class="camp-title">
    Camp {{ number }}
  </h4>
  <game-camp-banner
    :color="!energy ? 'gray' : (number === '1' ? 'red' : 'navy')"
  />
  <n-progress
    :percentage="energy"
    :data-value="energy"
    :show-indicator="false"
    type="line"
    color="#fa4"
    :height="8"
    :class="[
      'camp-energy',
      { 'camp-energy-zero': !energy },
    ]"
  />
</template>

<style lang="scss" scoped>
.camp-title {
  font-size: 20px;
  font-weight: 200;
  text-align: center;
  margin-bottom: 12px;
}
.camp-energy {
  margin-top: 24px;

  &::before {
    content: attr(data-value) "%";
    font-size: 12px;
    font-weight: 200;
    line-height: 2;
    text-align: center;
    color: #fa4;
    display: block;
    width: 100%;
  }

  &-zero::before {
    color: #666;
  }
}
</style>
