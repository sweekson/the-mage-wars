<script>
import { toRefs } from 'vue';
import { useTweenedNumber } from '@composables/use-tween';

export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    const { tweened } = useTweenedNumber({ number: value });
    return { tweened };
  },
};
</script>

<template>
  <span>{{ tweened }}</span>
</template>
