<script>
export default {
  inject: ['room'],
};
</script>

<template>
  <div
    v-if="room.counts > 0"
    class="counter"
  >
    <div class="counter-text">
      {{ room.counts }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes scale-down {
  0% {
    font-size: calc(var(--text-size) * 1.2);
    transform: scale(1.4);
  }
  100% {
    font-size: var(--text-size);
    transform: scale(1);
  }
}

.counter {
  --color: #{$color-mist-100};
  --border-color: #fff;
  --size: 120px;
  --text-size: 72px;
  --text-color: #fff;

  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--size) * 1.4);
  height: calc(var(--size) * 1.4);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  &-text {
    background-color: var(--color);
    border: 1px solid var(--border-color);
    border-radius: var(--size);
    font-weight: 200;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    animation: 1s scale-down infinite;
  }
}
</style>
