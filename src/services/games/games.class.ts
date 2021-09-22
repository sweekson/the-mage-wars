import { Params } from '@feathersjs/feathers';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { Application } from '../../declarations';
import { RoomResponse } from '../rooms/rooms.class';
import { Player, Players } from '../players/players.class';
import { makeResult, makeError } from '../../utils/common';

export type GamesQuery = {
  target?: string;
  spell?: string;
  rotate?: boolean;
  pray?: boolean;
  collect?: boolean;
  exchange?: boolean;
  accept?: boolean;
  cast?: boolean;
  casting?: boolean;
  confirm?: boolean;
  cancel?: boolean;
}

export type GamesParams = Params & {
  query: GamesQuery;
}

export enum GameStatus {
  Ready = 'ready',
  Wait = 'wait',
  Pray = 'pray',
  Exchange = 'exchange',
  Cast = 'cast',
  Confirm = 'confirm',
}

export interface Team {
  energy: number;
  players: Players;
}

export enum Steps {
  Pray = 1,
  Exchange = 2,
  Cast = 3,
  Pass = 4,
}

export interface Action {
  uid: string;
  step: Steps;
}

export interface Game {
  id: string;
  room: string;
  status: GameStatus;
  team1: Team;
  team2: Team;
  sequence: string[];
  players: Map<string, Player>;
  collected: Set<string>;
  confirmed: Set<string>;
  round: number;
  action: Action | null;
}

export const GameActions = [
  'rotate',
  'pray',
  'collect',
  'exchange',
  'accept',
  'cast',
  'casting',
  'confirm',
  'cancel',
];

export class Games {
  app: Application;
  map: Map<string, Game> = new Map();
  events: string[];
  [action: string]: any;

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = [
      'created',
      'update',
      'refreshed',
      'rotated',
      'collect',
      'collected',
      'accept',
      'accepted',
      'confirm',
      'confirmed',
      'remove',
      'removed',
      'destroy',
      'destroyed',
    ];
  }

  async get(id: string) {
    return this.transform(this.map.get(id));
  }

  async find(params: GamesParams) {
    const { room } = params.query;
    if (room) {
      return this.transform(this.list.find(x => x.room === room));
    }
    return this.list.map(this.transform);
  }

  async create(data: any, params: Params) {
    const game = this.makeGame(params.detail.room);

    this.map.set(game.id, game);

    return this.makeResult('created', game);
  }

  async update(id: string, data: any, params: GamesParams) {
    const game = this.map.get(id);
    const action = Object.keys(params.query).find(x => GameActions.includes(x)) || '';

    if (!game || !action) {
      return makeError('update', 400, 'Invalid query');
    }

    return this[action](game, params);
  }

  async remove(id: string) {
    const game = this.map.get(id);

    if (!game) {
      return makeError('remove', 404, 'Instance not found');
    }

    this.map.delete(id);

    return this.makeResult('removed', game);
  }

  rotate(game: Game) {
    const { sequence, action } = game;
    const length = sequence.length;
    const index = !action ? 0 : sequence.indexOf(action.uid) + 1;

    if (index === length) {
      return this.confirming(game);
    }

    const uid = sequence[index];

    game.status = GameStatus.Wait;
    game.action = { uid, step: Steps.Pray };

    return [
      this.makeResult('rotated', game, { receiver: uid }),
      this.makeResult('refreshed', game),
    ];
  }

  pray(game: Game) {
    return this.next(game, GameStatus.Pray);
  }

  collect(game: Game, params: GamesParams) {
    const { sequence, collected } = game;
    const { connection } = params;

    if (!connection) {
      return makeError('collect', 400, 'Empty connection instance');
    }

    const { _id } = connection.user;

    if (collected.has(_id)) {
      return makeError('collect', 400, 'Bad action');
    }

    collected.add(_id);

    const result = [this.makeResult('collected', game, { receiver: _id })];

    if (sequence.length === collected.size) {
      return result.concat(this.collected(game));
    }

    return result.concat(this.makeResult('refreshed', game));
  }

  collected(game: Game) {
    const { action } = game;

    if (!action) {
      return makeError('collected', 400, 'Bad action');
    }

    action.step = Steps.Exchange;
    game.collected.clear();

    return this.next(game, GameStatus.Wait);
  }

  exchange(game: Game) {
    return this.next(game, GameStatus.Exchange);
  }

  accept(game: Game, params: GamesParams) {
    const { action } = game;

    if (!action) {
      return makeError('accept', 400, 'Bad action');
    }

    action.step = Steps.Cast;

    return this.next(game, GameStatus.Wait);
  }

  cast(game: Game) {
    return this.next(game, GameStatus.Cast);
  }

  casting(game: Game, params: GamesParams) {
    const { action } = game;

    if (!action) {
      return makeError('casting', 400, 'Bad action');
    }

    action.step = Steps.Pass;

    return this.next(game, GameStatus.Wait);
  }

  confirming(game: Game) {
    game.action = null;
    return this.next(game, GameStatus.Confirm);
  }

  confirm(game: Game, params: GamesParams) {
    const { sequence, confirmed } = game;
    const { connection } = params;

    if (!connection) {
      return makeError('confirm', 400, 'Empty connection instance');
    }

    const { _id } = connection.user;

    if (confirmed.has(_id)) {
      return makeError('confirm', 400, 'Bad action');
    }

    confirmed.add(_id);

    const result = [this.makeResult('confirmed', game, { receiver: _id })];

    if (sequence.length === confirmed.size) {
      return result.concat(this.confirmed(game));
    }

    return result.concat(this.makeResult('refreshed', game));
  }

  confirmed(game: Game) {
    game.round += 1;
    game.confirmed.clear();
    return this.rotate(game);
  }

  cancel(game: Game) {
    return this.next(game, GameStatus.Wait);
  }

  next(game: Game, status: GameStatus) {
    game.status = status;
    return this.makeResult('refreshed', game);
  }

  destroy(room: string) {
    if (!room) {
      return makeError('destroy', 400, 'Bad request');
    }

    const game = this.list.find(x => x.room === room);

    if (!game) {
      return makeError('destroy', 404, 'Instance not found');
    }

    this.map.delete(game.id);

    return this.makeResult('destroyed', null, { id: game.id });
  }

  makeGame(room: RoomResponse): Game {
    const id = Math.random().toString(16).slice(2);
    const players = room.players.map(x => this.makePlayer(x));
    const { team1, team2 } = this.makeTeams(players);
    const sequence = players.map(x => x.uid).sort(() => Math.random() - .5);
    return {
      id,
      room: room.id,
      status: GameStatus.Ready,
      team1,
      team2,
      sequence,
      players: new Map(players.map(x => [x.uid, x])),
      collected: new Set(),
      confirmed: new Set(),
      round: 1,
      action: null,
    };
  }

  makeTeams(players: Players) {
    const { team } = this.config;
    const length = players.length;
    const half = Math.floor(length * .5);
    const sorted = players.slice(0).sort(() => Math.random() - .5);
    const team1 = {
      energy: team.energy * half,
      players: sorted.slice(0, half),
    };
    const team2 = {
      energy: team.energy * (length - half),
      players: sorted.slice(half),
    };
    team1.players.forEach(x => (x.team = 1));
    team2.players.forEach(x => (x.team = 2));
    return { team1, team2 };
  }

  makePlayer(player: Player): Player {
    const { strength, defense } = this.config.player;
    return {
      ...player,
      team: 0,
      strength,
      defense,
      elems: [],
      cards: [],
      attack: 0,
      attacked: 0,
    };
  }

  makeResult(type: string, game?: Game | null, extra?: any) {
    return makeResult(
      type,
      { game: this.transform(game), ...extra },
    );
  }

  transform(game: Game | null | undefined) {
    if (!game) return null;
    const { team1, team2, players, collected, confirmed } = game;
    return {
      // ...game,
      // players: Array.from(players.values()),
      ...omit(game, ['players', 'team1', 'team2']),
      team1: pick(team1, ['energy']),
      team2: pick(team2, ['energy']),
      players: Array.from(players.values()).map(x => pick(x, ['uid', 'name'])),
      collected: Array.from(collected),
      confirmed: Array.from(confirmed),
    };
  }

  get list() {
    return [...this.map.values()];
  }

  get config() {
    return this.app.get('game');
  }
}
