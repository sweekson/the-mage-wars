
export const halfOf = (size: number, type: 'floor' | 'ceil' | 'random') => {
  if (type === 'floor') return Math.floor(size * .5);
  if (type === 'ceil') return Math.ceil(size * .5);
  // type === 'random'
  const truthy = Boolean(Math.round(Math.random()));
  return truthy ? Math.floor(size * .5) : Math.ceil(size * .5);
};