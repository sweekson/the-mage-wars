import { Params } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { User } from '../users/users.class';
import { Player, Players } from '../players/players.class';
import { makeResult, makeError, toArray } from '../../utils/common';

export type RoomsQuery = {
  uid?: string;
  join?: boolean;
  start?: boolean;
  leave?: boolean;
}

export type RoomsParams = Params & {
  query: RoomsQuery;
}

export enum RoomStatus {
  Open = 'open',
  Ready = 'ready',
  Starting = 'starting',
  Started = 'started',
}

export interface Room {
  id: string;
  index: number;
  status: RoomStatus;
  name: string;
  admin: Player;
  players: Map<string, Player>;
}

export interface RoomJSON {
  id: string;
  index: number;
  status: RoomStatus;
  name: string;
  admin: Player;
  players: Players;
}

export class RoomsService {
  app: Application;
  map: Map<string, Room> = new Map();
  events: string[];

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = [
      'refreshed',
      'joined',
      'left',
      'starting',
      'started',
      'transferred',
      'deleted',
    ];
  }

  async get(id: string) {
    return this.transform(this.map.get(id));
  }

  async find(params: RoomsParams) {
    const { uid } = params.query;
    if (uid) {
      return this.transform(this.list.find(x => x.players.has(uid)));
    }
    return this.list.sort((a, b) => a.index - b.index).map(x => this.transform(x));
  }

  async create(data: Pick<Room, 'name'>, params: Params) {
    const { connection } = params;
    const room = this.makeRoom(data.name, connection?.user);

    this.map.set(room.id, room);
    this.joinChannel(room.id, connection);

    return this.transform(room);
  }

  async update(id: string, data: any, params: RoomsParams) {
    const room = this.map.get(id);
    const { join, start, leave } = params.query;

    if (!room) {
      return null;
    }
    if (join) {
      return this.join(params.connection, room);
    }
    if (start) {
      return this.start(params.connection, room);
    }
    if (leave) {
      return this.leave(params.connection, room);
    }

    return this.transform(room);
  }

  join(connection: any, room: Room) {
    const { _id: uid, name } = connection.user;

    if (!room.players.has(uid)) {
      room.players.set(uid, this.makePlayer(uid, name, false));
    }

    this.joinChannel(room.id, connection);

    if (
      room.status === RoomStatus.Open &&
      room.players.size >= this.config.minimum
    ) {
      room.status = RoomStatus.Ready;
    }

    return [
      this.makeResult('joined', room, { receiver: uid }),
      this.makeResult('refreshed', room),
    ];
  }

  leave(connection: any, room: Room) {
    const uid = connection.user._id;
    const { id, players } = room;
    const player = players.get(uid);

    if (!player) {
      return makeError(404, 'Player not found' );
    }

    players.delete(uid);

    if (!players.size) {
      this.map.delete(id);
      return [
        this.makeResult('left', room, { receiver: uid }),
        this.makeResult('deleted', room),
      ];
    }

    if (
      room.status === RoomStatus.Ready &&
      room.players.size < this.config.minimum
    ) {
      room.status = RoomStatus.Open;
    }

    if (!player.isAdmin) {
      return [
        this.makeResult('left', room, { receiver: uid }),
        this.makeResult('refreshed', room),
      ];
    }

    room.admin = toArray(players).sort((a, b) => a.index - b.index)[0];
    room.admin.isAdmin = true;

    return [
      this.makeResult('left', room, { receiver: uid }),
      this.makeResult('transferred', room, { receiver: room.admin.uid }),
      this.makeResult('refreshed', room),
    ];
  }

  start(connection: any, room: Room) {
    if (!connection) return makeError(401, 'Empty connection instance');

    const { _id } = connection.user;

    if (room.admin.uid !== _id) return makeError(403, 'Not a room admin');

    room.status = RoomStatus.Starting;

    return [
      this.makeResult('starting', room),
      this.makeResult('refreshed', room),
    ];
  }

  started(id: string) {
    const room = this.map.get(id);

    if (!room) return makeError(404, 'Room not found');

    room.status = RoomStatus.Started;

    return [
      this.makeResult('started', room),
      this.makeResult('refreshed', room),
    ];
  }

  restart(id: string) {
    const room = this.map.get(id);

    if (!room) return makeError(404, 'Room not found');

    if (room.status !== RoomStatus.Started) {
      return makeError(400, 'Bad action');
    }

    const isReady = room.players.size >= this.config.minimum;

    room.status = isReady ? RoomStatus.Ready : RoomStatus.Open;

    return this.makeResult('refreshed', room);
  }

  joinChannel(id: string, connection: any) {
    this.app.channel(`rooms/${id}`).join(connection);
  }

  leaveChannel(id: string, connection: any) {
    this.app.channel(`rooms/${id}`).leave(connection);
  }

  makeRoom(name: string, user: User): Room {
    const id = Math.random().toString(16).slice(2);
    const admin = this.makePlayer(user._id, user.name, true);
    const players = new Map([[user._id, admin]]);
    return {
      id,
      index: Date.now(),
      status: RoomStatus.Open,
      name,
      admin,
      players,
    };
  }

  makePlayer(uid: string, name: string, isAdmin: boolean): Player {
    return {
      index: Date.now(),
      uid,
      name,
      isAdmin,
    };
  }

  makeResult(type: string, room?: Room | null, extra?: any) {
    return makeResult(
      type,
      { room: this.transform(room), ...extra },
    );
  }

  transform(room: Room | null | undefined) {
    if (!room) return null;
    const { maximum } = this.config;
    const isMax = room.players.size === maximum;
    const isOpen = [RoomStatus.Open, RoomStatus.Ready].includes(room.status);
    const players = toArray(room.players);
    return {
      ...room,
      isOpen: !isMax && isOpen,
      players,
    };
  }

  get list() {
    return toArray(this.map);
  }

  get config() {
    return this.app.get('game');
  }
}
