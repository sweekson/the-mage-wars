import { Params } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { User } from '../users/users.class';
import { Player, Players } from '../players/players.class';
import { makeResult, makeError } from '../../utils/common';

export type RoomsQuery = {
  uid?: string;
  join?: boolean;
  leave?: boolean;
  starting?: boolean;
  started?: boolean;
}

export type RoomsParams = Params & {
  query: RoomsQuery;
}

export enum RoomStatus {
  Open = 'open',
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

export interface RoomResponse {
  id: string;
  index: number;
  status: RoomStatus;
  name: string;
  admin: Player;
  players: Players;
}

export class Rooms {
  app: Application;
  map: Map<string, Room> = new Map();
  events: string[];

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = [
      'joined',
      'left',
      'refreshed',
      'starting',
      'started',
      'deleted',
      'assigned',
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
    return this.list.sort((a, b) => a.index - b.index).map(this.transform);
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
    const { join, leave, starting, started } = params.query;

    if (!room) {
      return null;
    }
    if (join) {
      return this.join(params.connection, room);
    }
    if (leave) {
      return this.leave(params.connection, room);
    }
    if (starting) {
      return this.starting(room);
    }
    if (started) {
      return this.started(room);
    }

    return this.transform(room);
  }

  join(connection: any, room: Room) {
    const { _id: uid, name } = connection.user;
    const player = this.makePlayer(uid, name, false);

    room.players.set(uid, player);
    this.joinChannel(room.id, connection);

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
      return makeError(
        'leave',
        404,
        'Player not found',
      )
    }

    players.delete(uid);

    if (!players.size) {
      this.map.delete(id);
      return [
        this.makeResult('left', room, { receiver: uid }),
        this.makeResult('deleted', null, { id }),
      ];
    }

    if (!player.isAdmin) {
      return [
        this.makeResult('left', room, { receiver: uid }),
        this.makeResult('refreshed', room),
      ];
    }

    room.admin = [...players.values()].sort((a, b) => a.index - b.index)[0];

    return [
      this.makeResult('left', room, { receiver: uid }),
      this.makeResult('assigned', room, { receiver: room.admin.uid }),
      this.makeResult('refreshed', room),
    ];
  }

  starting(room: Room) {
    room.status = RoomStatus.Starting;
    return [
      this.makeResult('starting', room),
      this.makeResult('refreshed', room),
    ];
  }

  started(room: Room) {
    room.status = RoomStatus.Started;
    return [
      this.makeResult('started', room),
      this.makeResult('refreshed', room),
    ];
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

  makePlayer(uid: string, name: string, isAdmin: boolean) {
    return {
      index: Date.now(),
      uid,
      name,
      team: 0,
      elems: [],
      cards: [],
      attacked: 0,
      isAdmin: true,
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
    const isOpen = room.status === 'open';
    const players = [...room.players.values()];
    return {
      ...room,
      isOpen,
      players,
    };
  }

  get list() {
    return [...this.map.values()];
  }
}
