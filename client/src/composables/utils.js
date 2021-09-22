export const toValueMap = (values) => {
  const reducer = (map, key) => {
    return Object.assign(map, { [key]: values[key].value });
  };
  return Object.keys(values).reduce(reducer, {});
};