import { Service } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { GamesService, Game } from './games.class';
import { RoomStatus } from '../rooms/rooms.class';
import hooks from './games.hooks';
import { filterReceiver } from '../../utils/channel';
import { transmit } from '../../utils/hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'games': GamesService & Service<any>;
  }
}

export default function (app: Application) {
  app.use('/games', new GamesService(null, app));

  const { wait } = app.get('game');
  const rooms = app.service('rooms');
  const games = app.service('games');
  const toRoomUsers = (data: any) => app.channel(`rooms/${data.game.room}`);
  const toRoomReceivers = (data: any, context: any) => {
    return filterReceiver(`rooms/${data.game.room}`, context);
  };
  const onRoomStarted = ({ room }: any) => games.create({ room: room.id });
  const onRoomDeleted = async ({ room }: any) => {
    room.status === RoomStatus.Started && games.destroy(room.id);
  };
  const onPray = ({ game, context }: any) => {
    setTimeout(() => {
      context.result = games.prayed(game.id);
      transmit(context);
    }, wait.pray);
  };
  const onMove = ({ game, context }: any) => {
    setTimeout(() => {
      context.result = games.moved(game.id);
      transmit(context);
    }, wait.move);
  };

  games.hooks(hooks);

  games.publish('created', toRoomUsers);
  games.publish(toRoomReceivers);

  rooms.on('started', onRoomStarted);
  rooms.on('deleted', onRoomDeleted);

  games.on('pray', onPray);
  games.on('move', onMove);
}
