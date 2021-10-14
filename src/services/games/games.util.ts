import keyBy from 'lodash/keyBy';

import { CardDeck } from '../cards/cards.util';
import { GamePlayer, Buffs, Elems, Spells } from '../players/players.class';

export interface BuffHelper {
  match(card: RegExp): string;
  remove(card: string): boolean;
  has(card: string | RegExp): boolean;
}

export interface SpellHelperOptions {
  type: string;
  elems: Elems;
  spells: Spells;
}

export interface SpellHelper {
  valid(): boolean;
  sufficient(): boolean;
  cast(): void;
}

export const useBuffHelper = ({ buffs }: Buffs): BuffHelper => {
  const match = (card: RegExp): string => {
    return buffs[buffs.findIndex(x => card.test(x))];
  };
  const remove = (card: string): boolean => {
    const index = buffs.indexOf(card);
    if (index === -1) return false;
    buffs.splice(index, 1);
    return true;
  };
  const has = (card: string | RegExp): boolean => {
    if (typeof card === 'string') return buffs.includes(card);
    return buffs.findIndex(x => card.test(x)) > -1;
  };

  return { match, remove, has };
};

export const useSpellHelper = ({ type, elems, spells }: SpellHelperOptions): SpellHelper => {
  const map = keyBy(spells, 'type');
  const { costs } = map[type];
  const valid = () => !!map[type];
  const sufficient = () => {
    return costs.every(({ amount }, i) => elems[i].amount >= amount);
  };
  const cast = () => {
    costs.forEach(({ amount }, index) => elems[index].amount -= amount);
  };
  return { valid, sufficient, cast };
};

export const resolveAttack = (player: GamePlayer, card: string): number => {
  const { attributes = {} } = CardDeck.map[card];
  const { percent = 100 } = attributes;
  const buffs = useBuffHelper({ buffs: player.buffs });

  let attack = Math.floor(player.strength * percent * .01);

  if (buffs.has(/^B1/)) {
    const buff = buffs.match(/^B1/);
    const { attributes = {} } = CardDeck.map[buff];
    const { percent = 0 } = attributes;
    attack = Math.floor(attack * (100 - percent) * .01);
    buffs.remove(buff);
  }

  if (buffs.has(/^B2/)) {
    const buff = buffs.match(/^B2/);
    const { attributes = {} } = CardDeck.map[buff];
    const { percent = 0 } = attributes;
    attack = Math.floor(attack * (100 + percent) * .01);
    buffs.remove(buff);
  }

  return attack;
};
