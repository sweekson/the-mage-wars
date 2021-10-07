<script>
import { ref } from 'vue';

export default {
  props: {
    face: {
      type: Number,
      default: 1,
    },
    animation: {
      type: String,
      default: '1',
    },
    autoplay: {
      type: Boolean,
    },
  },
  setup(props) {
    const isOddRoll = ref(props.animation === '1');
    const play = (animation) => {
      setTimeout(() => isOddRoll.value = animation !== '1', 0);
    };
    return { isOddRoll, play };
  },
  mounted() {
    this.autoplay && this.play(this.animation);
  },
};
</script>

<template>
  <ol
    :data-face="face"
    :class="[
      'dice',
      { 'dice-odd-roll': isOddRoll },
      { 'dice-even-roll': !isOddRoll },
    ]"
  >
    <li
      class="dice-face"
      data-face="1"
    >
      <slot name="front" />
    </li>
    <li
      class="dice-face"
      data-face="2"
    >
      <slot name="bottom" />
    </li>
    <li
      class="dice-face"
      data-face="3"
    >
      <slot name="right" />
    </li>
    <li
      class="dice-face"
      data-face="4"
    >
      <slot name="left" />
    </li>
    <li
      class="dice-face"
      data-face="5"
    >
      <slot name="top" />
    </li>
    <li
      class="dice-face"
      data-face="6"
    >
      <slot name="back" />
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.dice {
  --size: 100px;
  --color: #{$color-dusk-400};
  --border-color: #222;

  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
}
.dice-even-roll {
  transition: transform 2.4s ease-out;
}
.dice-odd-roll {
  transition: transform 2s ease-out;
}
.dice-even-roll[data-face='1'] {
  transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
}
.dice-even-roll[data-face='2'] {
  transform: rotateX(450deg) rotateY(720deg) rotateZ(360deg);
}
.dice-even-roll[data-face='3'] {
  transform: rotateX(360deg) rotateY(630deg) rotateZ(360deg);
}
.dice-even-roll[data-face='4'] {
  transform: rotateX(360deg) rotateY(810deg) rotateZ(360deg);
}
.dice-even-roll[data-face='5'] {
  transform: rotateX(270deg) rotateY(720deg) rotateZ(360deg);
}
.dice-even-roll[data-face='6'] {
  transform: rotateX(360deg) rotateY(900deg) rotateZ(360deg);
}
.dice-odd-roll[data-face='1'] {
  transform: rotateX(-360deg) rotateY(-720deg) rotateZ(-360deg);
}
.dice-odd-roll[data-face='2'] {
  transform: rotateX(-270deg) rotateY(-720deg) rotateZ(-360deg);
}
.dice-odd-roll[data-face='3'] {
  transform: rotateX(-360deg) rotateY(-810deg) rotateZ(-360deg);
}
.dice-odd-roll[data-face='4'] {
  transform: rotateX(-360deg) rotateY(-630deg) rotateZ(-360deg);
}
.dice-odd-roll[data-face='5'] {
  transform: rotateX(-450deg) rotateY(-720deg) rotateZ(-360deg);
}
.dice-odd-roll[data-face='6'] {
  transform: rotateX(-360deg) rotateY(-900deg) rotateZ(-360deg);
}
.dice-face {
  background-color: var(--color);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  grid-column: 1;
  grid-row: 1;
  width: var(--size);
  height: var(--size);
}
.dice-face[data-face='1'] {
  transform: rotate3d(0, 0, 0, 90deg) translateZ(calc(var(--size) * .5));
}
.dice-face[data-face='2'] {
  transform: rotate3d(-1, 0, 0, 90deg) translateZ(calc(var(--size) * .5));
}
.dice-face[data-face='3'] {
  transform: rotate3d(0, 1, 0, 90deg) translateZ(calc(var(--size) * .5));
}
.dice-face[data-face='4'] {
  transform: rotate3d(0, -1, 0, 90deg) translateZ(calc(var(--size) * .5));
}
.dice-face[data-face='5'] {
  transform: rotate3d(1, 0, 0, 90deg) translateZ(calc(var(--size) * .5));
}
.dice-face[data-face='6'] {
  transform: rotate3d(1, 0, 0, 180deg) translateZ(calc(var(--size) * .5));
}
</style>
