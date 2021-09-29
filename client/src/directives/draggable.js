import { useDraggable } from '@composables/use-draggable';

export const draggable = {
  mounted(el, binding) {
    const draggable = useDraggable(binding.value);
    el.addEventListener('mousedown', draggable.onMousedown);
    el.addEventListener('mousemove', draggable.onMousemove);
    el.addEventListener('mouseup', draggable.onMouseup);
  },
};
