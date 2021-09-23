<script>
export default {
  inject: ['game'],
}
</script>

<template>
  <section class="my-status">
    <div class="team">{{ game.me.team }}</div>
  </section>
</template>

<style lang="scss" scoped>
.my-status {
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
</style>