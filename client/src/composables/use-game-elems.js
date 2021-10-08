import { pipe } from '../utils/common';

export const ElemIconNameMap = {
  1: 'drop',
  2: 'electric',
  3: 'flamer',
  4: 'three-leaves',
};

export const ElemIconColorMap = {
  1: 'cyan',
  2: 'yellow',
  3: 'volcano',
  4: 'green',
};

export const resolveElemIconName = (tiles) => {
  return tiles.map(tile => {
    const name = ElemIconNameMap[tile.type];
    return Object.assign(tile, { name });
  });
};

export const resolveElemIconColor = (tiles) => {
  return tiles.map(tile => {
    const color = ElemIconColorMap[tile.type];
    return Object.assign(tile, { color });
  });
};

export const resolveElemIconProps = pipe(
  resolveElemIconName,
  resolveElemIconColor,
);
