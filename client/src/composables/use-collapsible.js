import { ref } from 'vue';

export const useCollapsible = ({ value }) => {
  const expanded = ref(value ?? false);
  const toggle = () => (expanded.value = !expanded.value);

  return {
    expanded,
    toggle,
  };
};
