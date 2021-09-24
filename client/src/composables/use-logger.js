import { ref, computed } from 'vue';

import { useEnv } from './use-env';

export const useLogger = () => {
  const env = useEnv();
  const logs = ref([]);
  const time = () => new Date().toTimeString().slice(0, 8);
  const enabled = computed(() => env.is('LOGGING', 'YES'));
  const log = (level, text) => {
    if (!enabled.value) return;
    logs.value.push({ level, text: text.join(' '), time: time() });
  };
  const info = (...text) => log('INFO', text);
  const warn = (...text) => log('WARN', text);
  const error = (...text) => log('ERROR', text);
  const clear = () => (logs.value = []);

  return {
    logs,
    info,
    warn,
    error,
    clear,
  };
};
