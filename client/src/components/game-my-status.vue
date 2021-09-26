<script>
import Flexbox from '@components/flexbox';

export default {
  inject: ['game'],
  components: {
    Flexbox,
  },
}
</script>

<template>
  <flexbox class="my-status align-items-start">
    <div class="team">{{ game.me.team }}</div>
    <flexbox class="attribute">
      <span class="flex-1">Strength</span> {{ game.me.strength }}
    </flexbox>
    <flexbox class="attribute">
      <span class="flex-1">Defense</span> {{ game.me.defense }}
    </flexbox>
  </flexbox>
</template>

<style lang="scss" scoped>
.my-status {
  justify-content: flex-start;
  margin-bottom: 12px;
}
.team {
  background-color: #333;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  display: inline-block;
  width: 20px;
  height: 20px;
}
.attribute {
  background-color: #666;
  border-radius: 10px;
  font-weight: 300;
  line-height: 20px;
  color: #fff;
  width: 100px;
  height: 20px;
  margin-left: 4px;
  padding: 2px 8px;
}
</style>