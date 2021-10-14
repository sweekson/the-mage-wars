import Chance from 'chance';
import pick from 'lodash/pick';

import { GameCards, GameCardMap } from './cards.constants';
import { Cards } from './cards.class';

export const draw = (amount: number, weight = 9999): Cards => {
  const chance = new Chance();
  const defs = GameCards.filter(x => x.weight <= weight);
  const random = () => {
    const id = chance.weighted(
      defs.map(x => x.id),
      defs.map(x => x.weight),
    );
    const card = GameCardMap[id];
    return pick(
      card,
      ['id', 'name', 'description', 'icon', 'level', 'attributes'],
    );
  };
  return new Array(amount).fill(0).map(() => random());
};

export const remove = (cards: Cards, target: string): boolean => {
  const index = cards.findIndex(x => x.id === target);
  if (index === -1) return false;
  cards.splice(index, 1);
  return true;
};

export const isEnhance = (card: string): boolean => /^E/.test(card);
export const isAttack = (card: string): boolean => /^A/.test(card);
export const isHeal = (card: string): boolean => /^H/.test(card);
export const isBuff = (card: string): boolean => /^B/.test(card);
export const isPositvieBuff = (card: string): boolean => {
  return /^(B2|B002)/.test(card);
};
export const isNegativeBuff = (card: string): boolean => {
  return /^(B1|B001)/.test(card);
};

export const CardDeck = {
  list: GameCards,
  map: GameCardMap,
  draw,
  remove,
  isEnhance,
  isAttack,
  isHeal,
  isBuff,
  isPositvieBuff,
  isNegativeBuff,
};
