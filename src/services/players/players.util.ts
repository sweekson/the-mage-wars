import pick from 'lodash/pick';
import { isPositvieBuff } from '../cards/cards.util';

import { GamePlayer } from './players.class';

export const toPlayerJSON = (player: GamePlayer): Partial<GamePlayer> => {
  return pick(player, ['uid', 'name', 'color', 'position']);
};

export const toMyPlayerJSON = (player: GamePlayer): Partial<GamePlayer> => {
  const buffs = player.buffs.map(x => isPositvieBuff(x) ? '1' : '0');
  const hidden = ['index', 'attack', 'attacked', 'buffs'];
  const shown = Object.keys(player).filter(x => !hidden.includes(x));
  return { ...pick(player, shown), buffs };
};
