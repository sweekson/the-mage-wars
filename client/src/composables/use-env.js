
export const useEnv = () => {
  const get = (key) => process.env[`VUE_APP_${key}`];
  const has = (key) => !!get(key);
  const is = (key, val) => get(key) === val;
  return { get, has, is };
};
