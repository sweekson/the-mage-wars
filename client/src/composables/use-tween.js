import { ref, watch } from 'vue';
import TWEEN from '@tweenjs/tween.js';

export const useTweenedNumber = ({ number, duration = 250 }) => {
  const tweened = ref(number.value);
  const onUpdate = (tween) => (tweened.value = tween.number.toFixed(0));
  const update = (previous, current, duration) => {
    new TWEEN.Tween({ number: previous })
      .to({ number: current }, duration)
      .onUpdate(onUpdate)
      .start();
  };
  const animate = () => {
    TWEEN.update();
    requestAnimationFrame(animate);
  };

  watch(number, (current, previous) => {
    update(previous, current, duration);
  });

  requestAnimationFrame(animate);

  return { tweened };
};
