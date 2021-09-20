import { ServiceAddons, HookContext } from '@feathersjs/feathers';
import { AuthenticationResult } from '@feathersjs/authentication';

import { Application } from '../../declarations';
import { Rooms, Room } from './rooms.class';
import hooks from './rooms.hooks';
import { filterReceiver } from '../../utils/channel';

declare module '../../declarations' {
  interface ServiceTypes {
    'rooms': Rooms & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  app.use('/rooms', new Rooms(null, app));

  const { wait } = app.get('game');
  const rooms = app.service('rooms');
  const toRoomUsers = ({ room }: any) => app.channel(`rooms/${room.id}`);
  const toRoomReceivers = (data: any, context: any) => {
    console.log('filter', context.result.type);
    return filterReceiver(`rooms/${data.room.id}`, context);
  };
  const onStarting = ({ room }: any) => {
    setTimeout(() => {
      rooms.update(room.id, {}, { query: { started: true } });
    }, wait.start);
  };
  const onLeft = ({ room, context }: any) => {
    console.log('left');
    rooms.leaveChannel(room.id, context.params.connection);
  };
  const onLogout = async ({ user }: AuthenticationResult) => {
    const uid = user._id;
    const room: any = await rooms.find({ query: { uid } });
    if (!room) return;
    const query = { leave: true };
    const connection = { user };
    rooms.update(room.id, {}, { query, connection });
  };

  rooms.hooks(hooks);

  rooms.publish('joined', toRoomReceivers);
  rooms.publish('assigned', toRoomReceivers);
  rooms.publish('left', toRoomReceivers);
  rooms.publish('starting', toRoomUsers);
  rooms.publish('started', toRoomUsers);

  rooms.on('starting', onStarting);
  rooms.on('left', onLeft);

  app.on('logout', onLogout);
}
