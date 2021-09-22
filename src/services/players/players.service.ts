import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PlayersController } from './players.class';

declare module '../../declarations' {
  interface ServiceTypes {
    'players': PlayersController & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  app.use('/players', new PlayersController(null, app));

  const players = app.service('players');

  players.publish(() => app.channel('authenticated'));
}
