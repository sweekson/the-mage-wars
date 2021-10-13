import pick from 'lodash/pick';

import { GamePlayer } from './players.class';

export const toPlayerJSON = (player: GamePlayer) => {
  const buffs = new Array(player.buffs.length).fill(1);
  return { ...pick(player, ['uid', 'name', 'color']), buffs };
};

