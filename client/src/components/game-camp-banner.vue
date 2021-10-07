<script>
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    GameIcon,
  },
  props: {
    color: {
      type: String,
      default: 'silver',
    },
    size: {
      type: String,
      default: '6xl',
    },
  },
};
</script>

<template>
  <div>
    <game-icon
      name="vertical-banner"
      :color="color"
      :size="size"
    />
  </div>
</template>
