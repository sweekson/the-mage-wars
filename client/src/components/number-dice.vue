<script>
import BlankDice from '@components/blank-dice.vue';

export default {
  components: {
    BlankDice,
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
};
</script>

<template>
  <blank-dice
    :face="value"
    animation="1"
    autoplay
    class="number-dice"
  >
    <template #front>
      <div
        data-side="1"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
      </div>
    </template>

    <template #bottom>
      <div
        data-side="2"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
      </div>
    </template>

    <template #left>
      <div
        data-side="3"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
      </div>
    </template>

    <template #right>
      <div
        data-side="4"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
      </div>
    </template>

    <template #top>
      <div
        data-side="5"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
      </div>
    </template>

    <template #back>
      <div
        data-side="6"
        class="number-dice-dots"
      >
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
        <span class="number-dice-dot" />
      </div>
    </template>
  </blank-dice>
</template>

<style lang="scss" scoped>
.number-dice {
  --color: #{$color-mist-400};
  --border-color: #eee;
}
.number-dice-dots {
  display: grid;
  grid-template-areas:
    'one two three'
    'four five six'
    'seven eight nine';
  width: 100%;
  height: 100%;
  padding: 16px;
}
.number-dice-dot {
  background-color: #555;
  box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.5);
  display: block;
  place-self: center;
  border-radius: 50%;
  width: 18px;
  height: 18px;
}
[data-side='1'] .number-dice-dot:nth-of-type(1) {
  grid-area: five;
}
[data-side='2'] .number-dice-dot:nth-of-type(1) {
  grid-area: one;
}
[data-side='2'] .number-dice-dot:nth-of-type(2) {
  grid-area: nine;
}
[data-side='3'] .number-dice-dot:nth-of-type(1) {
  grid-area: one;
}
[data-side='3'] .number-dice-dot:nth-of-type(2) {
  grid-area: five;
}
[data-side='3'] .number-dice-dot:nth-of-type(3) {
  grid-area: nine;
}
[data-side='4'] .number-dice-dot:nth-of-type(1) {
  grid-area: one;
}
[data-side='4'] .number-dice-dot:nth-of-type(2) {
  grid-area: three;
}
[data-side='4'] .number-dice-dot:nth-of-type(3) {
  grid-area: seven;
}
[data-side='4'] .number-dice-dot:nth-of-type(4) {
  grid-area: nine;
}
[data-side='5'] .number-dice-dot:nth-of-type(1) {
  grid-area: one;
}
[data-side='5'] .number-dice-dot:nth-of-type(2) {
  grid-area: three;
}
[data-side='5'] .number-dice-dot:nth-of-type(3) {
  grid-area: five;
}
[data-side='5'] .number-dice-dot:nth-of-type(4) {
  grid-area: seven;
}
[data-side='5'] .number-dice-dot:nth-of-type(5) {
  grid-area: nine;
}
[data-side='6'] .number-dice-dot:nth-of-type(1) {
  grid-area: one;
}
[data-side='6'] .number-dice-dot:nth-of-type(2) {
  grid-area: three;
}
[data-side='6'] .number-dice-dot:nth-of-type(3) {
  grid-area: four;
}
[data-side='6'] .number-dice-dot:nth-of-type(4) {
  grid-area: six;
}
[data-side='6'] .number-dice-dot:nth-of-type(5) {
  grid-area: seven;
}
[data-side='6'] .number-dice-dot:nth-of-type(6) {
  grid-area: nine;
}
</style>
