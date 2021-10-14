<script>
import GameIcon from '@components/game-icon.vue';

export default {
  components: {
    GameIcon,
  },
  inject: ['game'],
};
</script>

<template>
  <div class="my-buffs">
    <game-icon
      v-for="(buff, index) in game.me.buffs"
      :key="index"
      name="gold-shell"
      :color="buff === '1' ? 'orange' : 'turquoise'"
      shape="circle"
      size="sm"
      class="my-buff-icon"
    />
  </div>
</template>

<style lang="scss" scoped>
.my-buffs {
  text-align: right;
}
.my-buff-icon + .my-buff-icon {
  margin-left: 2px;
}
</style>
