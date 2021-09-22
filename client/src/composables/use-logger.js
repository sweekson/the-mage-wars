import { ref } from 'vue';

export const useLogger = () => {
  const logs = ref([]);
  const time = () => new Date().toTimeString().slice(0, 8);
  const log = (level, text) => {
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
