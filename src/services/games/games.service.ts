import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { Games, Game } from './games.class';
import hooks from './games.hooks';
import { filterReceiver } from '../../utils/channel';

declare module '../../declarations' {
  interface ServiceTypes {
    'games': Games & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  app.use('/games', new Games(null, app));

  const rooms = app.service('rooms');
  const games = app.service('games');
  const toRoomUsers = (data: any) => app.channel(`rooms/${data.room}`);
  const toRoomReceivers = (data: any, context: any) => {
    return filterReceiver(`rooms/${data.game.room}`, context);
  };
  const onRoomDeleted = ({ id }: any) => games.remove(id);

  games.hooks(hooks);

  games.publish('created', toRoomUsers);
  games.publish(toRoomReceivers);

  rooms.on('deleted', onRoomDeleted);
}
