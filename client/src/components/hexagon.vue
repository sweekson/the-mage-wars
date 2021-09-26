<script>
export default {
  props: {
    height: {
      type: [Number, String],
      default: 100,
    },
    color: {
      type: String,
      default: '#333',
    },
  },
}
</script>

<template>
  <div class="hexagon" :style="`--height: ${height}px; --color: ${color};`">
    <div><slot /></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.hexagon {
  --height: 100px;
  --width: calc(var(--height) * 0.575);
  --color: #333;

  width: var(--width);
  height: var(--height);
  position: relative;
}
.hexagon div {
  background-color: var(--color);
  box-sizing: border-box;
  width: var(--width);
  height: var(--height);
  position: absolute;
  left: calc(var(--height) * 0.307);
  transform-origin: center;
  box-sizing: border-box;
}
.hexagon div:nth-of-type(1) {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(0deg);
  z-index: 1;
}
.hexagon div:nth-of-type(2) {
  transform: rotate(60deg);
}
.hexagon div:nth-of-type(3) {
  transform: rotate(120deg);
}
</style>