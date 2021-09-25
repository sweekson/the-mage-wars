import { ServiceAddons, Params } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { PlayersController } from './players.class';
import hooks from './players.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'players': PlayersController & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  app.use('/players', new PlayersController(null, app));

  const players = app.service('players');
  const onConnectionChanged = async (auth: any, { connection }: Params) => {
    connection && players.find();
  };

  players.hooks(hooks);

  players.publish(() => app.channel('authenticated'));

  app.on('login', onConnectionChanged);
  app.on('logout', onConnectionChanged);
}
