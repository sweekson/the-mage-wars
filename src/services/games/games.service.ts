import { ServiceAddons } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { GamesService, Game } from './games.class';
import hooks from './games.hooks';
import { filterReceiver } from '../../utils/channel';

declare module '../../declarations' {
  interface ServiceTypes {
    'games': GamesService & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  app.use('/games', new GamesService(null, app));

  const rooms = app.service('rooms');
  const games = app.service('games');
  const toRoomUsers = (data: any) => app.channel(`rooms/${data.game.room}`);
  const toRoomReceivers = (data: any, context: any) => {
    return filterReceiver(`rooms/${data.game.room}`, context);
  };
  const onRoomStarted = ({ room }: any) => games.create({ room: room.id });
  const onRoomDeleted = async ({ id }: any) => games.destroy(id);

  games.hooks(hooks);

  games.publish('created', toRoomUsers);
  games.publish(toRoomReceivers);

  rooms.on('started', onRoomStarted);
  rooms.on('deleted', onRoomDeleted);
}
