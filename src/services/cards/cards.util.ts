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

export const CardDeck = { list: GameCards, map: GameCardMap, draw };