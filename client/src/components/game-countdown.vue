<script>
export default {
  inject: ['room'],
}
</script>

<template>
  <div v-if="room.counts" class="counter">
    <div class="counter-colored-blocks">
      <div class="counter-colored-blocks-rotater">
        <div class="counter-colored-block"></div>
        <div class="counter-colored-block"></div>
        <div class="counter-colored-block"></div>
        <div class="counter-colored-block"></div>
      </div>
      <div class="counter-text">{{ room.counts }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

$color: #236;

$color1: #f36;
$color2: #fd2;
$color3: #2c6;
$color4: #2bf;

$colors: (
  1: $color1,
  2: $color2,
  3: $color3,
  4: $color4,
);

$blocks: 4;
$degree: 360deg / $blocks;

$height: 160px;
$width: 160px;
$padding: 6px;
$border-radius: 80px;

.counter {
  border-radius: $border-radius;
  width: $width;
  height: $height;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  &-colored-blocks {
    border-radius: $border-radius;
    overflow: hidden;
    width: $width;
    height: 100%;
    padding: $padding;
    position: absolute;
    top: 0;

    &-rotater {
      border-radius: inherit;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      animation: rotation 1s linear infinite;
    }
  }

  &-colored-block {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;

    @each $index, $color in $colors {
      &:nth-child(#{$index}) {
        $rotate: $degree * ($index - 1);
        $skew: 90deg - $degree;
        background-color: $color;
        transform: rotate($rotate) skewX($skew);
      }
    }
  }

  &-text {
    background-color: $color;
    border-radius: inherit;
    font-size: 100px;
    font-weight: 200;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}

</style>