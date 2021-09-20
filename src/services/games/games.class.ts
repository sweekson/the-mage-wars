import { Params } from '@feathersjs/feathers';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import { Application } from '../../declarations';
import { RoomResponse } from '../rooms/rooms.class';
import { Players } from '../players/players.class';
import { makeResult, makeError } from '../../utils/common';

export type GamesQuery = {
  room?: string;
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
  collected: Set<string>;
  confirmed: Set<string>;
  round: number;
  action: Action | null;
}

export class Games {
  app: Application;
  map: Map<string, Game> = new Map();
  events: string[];

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = [
      'refreshed',
      'rotated',
      'confirmed',
      'deleted',
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

    return this.transform(game);
  }

  async update(id: string, data: any, params: GamesParams) {
    const game = this.map.get(id);
    const {
      uid, tid, sid, rotate, pray, collect, exchange, accept, cast, casting, confirm, cancel,
    } = params.query;

    if (!game) {
      return null;
    }
    if (rotate) {
      return this.rotate(game);
    }
    if (pray) {
      return this.pray(game);
    }
    if (collect) {
      return this.collect(game, uid);
    }
    if (exchange) {
      return this.exchange(game);
    }
    if (accept) {
      return this.accept(game, tid);
    }
    if (cast) {
      return this.cast(game);
    }
    if (casting) {
      return this.casting(game, sid);
    }
    if (confirm) {
      return this.confirm(game, uid);
    }
    if (cancel) {
      return this.cancel(game);
    }

    return this.transform(game);
  }

  async remove(id: string) {
    if (!this.map.has(id)) {
      return makeError('delete', 404, 'Instance not found');
    }

    this.map.delete(id);

    return this.makeResult('deleted', null, { id });
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

  collect(game: Game, uid: string) {
    const { sequence, collected } = game;

    if (collected.has(uid)) {
      return makeError('collect', 400, 'Bad action');
    }

    collected.add(uid);

    const result = [this.makeResult('collected', game, { receiver: uid })];

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

  accept(game: Game, tid: string) {
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

  casting(game: Game, sid: string) {
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

  confirm(game: Game, uid: string) {
    const { sequence, confirmed } = game;

    if (confirmed.has(uid)) {
      return makeError('confirm', 400, 'Bad action');
    }

    confirmed.add(uid);

    const result = [this.makeResult('confirmed', game, { receiver: uid })];

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

  makeGame(room: RoomResponse): Game {
    const id = Math.random().toString(16).slice(2);
    const { players } = room;
    const { team1, team2 } = this.makeTeams(players);
    const sequence = players.map(x => x.uid);
    return {
      id,
      room: room.id,
      status: GameStatus.Ready,
      team1,
      team2,
      sequence,
      collected: new Set(),
      confirmed: new Set(),
      round: 1,
      action: null,
    };
  }

  makeTeams(players: Players) {
    const { team } = this.app.get('game');
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
    return { team1, team2 };
  }

  makeResult(type: string, game?: Game | null, extra?: any) {
    return makeResult(
      type,
      { game: this.transform(game), ...extra },
    );
  }

  transform(game: Game | null | undefined) {
    if (!game) return null;
    const { team1, team2, collected, confirmed } = game;
    return {
      ...omit(game, ['teams']),
      team1: pick(team1, ['energy']),
      team2: pick(team2, ['energy']),
      collected: Array.from(collected),
      confirmed: Array.from(confirmed),
    };
  }

  get list() {
    return [...this.map.values()];
  }
}
