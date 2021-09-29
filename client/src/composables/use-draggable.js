import { ref } from 'vue';

export const useDraggable = ({ handle }) => {
  const dragging = ref(false);
  const shiftX = ref(0);
  const shiftY = ref(0);
  const adjust = (rect, x, y) => {
    const { innerWidth, innerHeight } = window;
    const width = parseInt(rect.width);
    const height = parseInt(rect.height);
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + width > innerWidth) x = innerWidth - width;
    if (y + height > innerHeight) y = innerHeight - height;
    return { x, y };
  };
  const draggable = (handle, target) => {
    if (!handle) return true;
    const $handle = document.querySelector(handle);
    return $handle.contains(target);
  };
  const onMousedown = (e) => {
    if (!draggable(handle, e.target)) return;

    const { left, top } = e.currentTarget.getBoundingClientRect();

    dragging.value = true;
    shiftX.value = e.clientX - left;
    shiftY.value = e.clientY - top;
  };
  const onMousemove = (e) => {
    if (!dragging.value) return;

    const { x, y } = adjust(
      e.currentTarget.getBoundingClientRect(),
      e.clientX - shiftX.value,
      e.clientY - shiftY.value,
    );

    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onMouseup = () => (dragging.value = false);

  return {
    onMousedown,
    onMousemove,
    onMouseup,
  };
};
