import { pipe } from '../utils/common';

export const ElemIconNameMap = {
  1: 'drop',
  2: 'flamer',
  3: 'three-leaves',
  4: 'electric',
};

export const ElemIconColorMap = {
  1: 'cyan',
  2: 'volcano',
  3: 'green',
  4: 'yellow',
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
