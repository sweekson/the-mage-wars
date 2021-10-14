import { ref } from 'vue';

const focused = ref(true);

window.addEventListener('focus', () => (focused.value = true));
window.addEventListener('blur', () => (focused.value = false));

export const useWindowFocus = () => {
  return { focused };
};
