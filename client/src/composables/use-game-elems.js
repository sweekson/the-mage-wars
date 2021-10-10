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

export const resolveElemIconName = (elem) => {
  return Object.assign(elem, { name: ElemIconNameMap[elem.type] });
};

export const resolveElemIconColor = (elem) => {
  return Object.assign(elem, { color: ElemIconColorMap[elem.type] });
};

export const resolveElemIconProps = pipe(
  resolveElemIconName,
  resolveElemIconColor,
);

export const resolveElemsProps = (elems) => elems.map(resolveElemIconProps);
