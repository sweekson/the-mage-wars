import { Params } from '@feathersjs/feathers';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import range from 'lodash/range';
import random from 'lodash/random';

import { Application } from '../../declarations';
import { resolveAttack, useBuffHelper, useSpellHelper, useGameMapHelper } from './games.util';
import { RoomJSON } from '../rooms/rooms.class';
import {
  Player, GamePlayer, GamePlayers,
  ExchangingPlayer, Elems, ExchangingElems,
} from '../players/players.class';
import { toPlayerJSON, toMyPlayerJSON } from '../players/players.util';
import { Cards } from '../cards/cards.class';
import { CardDeck } from '../cards/cards.util';
import { makeResult, makeError, toArray } from '../../utils/common';
import { halfOf } from '../../utils/math';

export type GamesQuery = {
  target?: string;
  spell?: string;
  card?: string;
  elems?: ExchangingElems;
  assigned?: boolean;
  rotate?: boolean;
  pray?: boolean;
  collect?: boolean;
  exchange?: boolean;
  reply?: boolean;
  regret?: boolean;
  accept?: boolean;
  cast?: boolean;
  enchant?: boolean;
  move?: boolean;
  confirm?: boolean;
  cancel?: boolean;
  leave?: boolean;
}

export type GamesParams = Params & {
  query: GamesQuery;
}

export enum GameStatus {
  Ready = 'ready',
  Wait = 'wait',
  Pray = 'pray',
  Collect = 'collect',
  Exchange = 'exchange',
  Cast = 'cast',
  Move = 'move',
  Confirm = 'confirm',
}

export interface Team {
  energy: number;
  players: GamePlayers;
}

export enum Steps {
  Pray = 1,
  Exchange = 2,
  Cast = 3,
  Move = 4,
  Pass = 5,
}

export interface Action {
  uid: string;
  step: Steps;
  moves: number;
  moved: boolean;
}

export interface Exchange {
  requester: ExchangingPlayer;
  responses: ExchangingPlayer[];
}

export interface Tile {
  index: number;
  type: number;
  order: number;
  occupied: Array<number>;
  players: Array<number>;
}

export type Tiles = Tile[];

export interface GameMap {
  size: number;
  tiles: Tiles;
}

export interface Game {
  id: string;
  room: string;
  status: GameStatus;
  map: GameMap;
  team1: Team;
  team2: Team;
  sequence: string[];
  players: Map<string, GamePlayer>;
  collected: Set<string>;
  confirmed: Set<string>;
  round: number;
  dice1: number;
  dice2: number;
  action: Action | null;
  exchange: Exchange | null;
}

export const GameActions = [
  'rotate',
  'pray',
  'collect',
  'exchange',
  'reply',
  'regret',
  'accept',
  'cast',
  'enchant',
  'move',
  'confirm',
  'cancel',
  'leave',
];

export class GamesService {
  app: Application;
  map: Map<string, Game> = new Map();
  events: string[];
  [action: string]: any;

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = [
      'created',
      'found',
      'assigned',
      'refreshed',
      'rotated',
      'collected',
      'accepted',
      'casted',
      'peeked',
      'attacked',
      'healed',
      'affected',
      'move',
      'confirmed',
      'removed',
      'destroyed',
    ];
  }

  async get(id: string) {
    return this.transform(this.map.get(id));
  }

  async find(params: GamesParams) {
    const { room, assigned } = params.query;
    if (room) {
      return this.findByRoom(room, params);
    }
    if (assigned) {
      return this.findMyTeam(params);
    }
    return makeError(403, 'Access denied');
  }

  async create(data: any, params?: Params) {
    if (!params) return makeError(400, 'Incorrect parameters');

    const { room } = params.detail;

    if (!room) return makeError(404, 'Room not found');

    const game = this.makeGame(room);

    this.map.set(game.id, game);

    return this.makeResult('created', game);
  }

  async update(id: string, data: any, params: GamesParams) {
    const game = this.map.get(id);
    const action = Object.keys(params.query).find(x => GameActions.includes(x)) || '';

    if (!game || !action) {
      return makeError(400, 'Invalid query');
    }

    return this[action](game, params);
  }

  async remove(id: string) {
    const game = this.map.get(id);

    if (!game) {
      return makeError(404, 'Instance not found');
    }

    this.map.delete(id);

    return this.makeResult('removed', game);
  }

  findByRoom(room: string, params: GamesParams) {
    const game = this.list.find(x => x.room === room);

    if (!game) {
      return makeError(404, 'Game not found', { room });
    }

    const { connection } = params;

    if (!connection) return makeError(401, 'Empty connection instance');

    const { _id } = connection.user;

    return this.makeResult('found', game, { receiver: _id });
  }

  findMyTeam(params: GamesParams) {
    const game = this.map.get(params.query.id);

    if (!game) return makeError(400, 'Game not found');

    const { connection } = params;

    if (!connection) return makeError(401, 'Empty connection instance');

    const { _id } = connection.user;
    const me = game.players.get(_id);

    if (!me) return makeError(404, 'Player not found');

    return this.makeResult('assigned', game, {
      receiver: me.uid,
      player: toMyPlayerJSON(me),
    });
  }

  rotate(game: Game) {
    const { sequence, action } = game;
    const length = sequence.length;
    const index = !action ? 0 : sequence.indexOf(action.uid) + 1;

    if (index === length) {
      return this.confirming(game);
    }

    const uid = sequence[index];
    const next = game.players.get(uid);

    if (!next) return makeError(404, 'Player not found');

    game.status = GameStatus.Wait;
    game.action = { uid, step: Steps.Pray, moves: 0, moved: false };
    next.exchanges = 3;
    next.actions = 3;

    return [
      this.makeResult('rotated', game, { receiver: uid }),
      this.makeResult('assigned', game, {
        receiver: next.uid,
        player: toMyPlayerJSON(next),
      }),
      this.makeResult('refreshed', game),
    ];
  }

  pray(game: Game) {
    game.dice1 = random(1, 6);
    game.dice2 = random(1, 6);

    return [
      this.makeResult('pray', game),
      this.next(game, GameStatus.Pray),
    ];
  }

  prayed(id: string) {
    const game = this.map.get(id);

    if (!game) return makeError(404, 'Game not found');

    return this.next(game, GameStatus.Collect);
  }

  collect(game: Game, params: GamesParams) {
    const { sequence, collected } = game;
    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id } = connection.user;

    if (collected.has(_id)) {
      return makeError(400, 'Bad action');
    }

    collected.add(_id);

    const result: Promise<any>[] = [
      this.makeResult('collected', game, { receiver: _id }),
    ];

    if (sequence.length === collected.size) {
      return result.concat(this.collected(game));
    }

    return result.concat(this.makeResult('refreshed', game));
  }

  collected(game: Game) {
    const { action } = game;

    if (!action) {
      return makeError(400, 'Bad action');
    }

    action.step = Steps.Exchange;
    game.dice1 = 0;
    game.dice2 = 0;
    game.collected.clear();

    return this.next(game, GameStatus.Wait);
  }

  exchange(game: Game, params: GamesParams) {
    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id, name } = connection.user;
    const player = game.players.get(_id);

    if (!player) return makeError(404, 'Player not found');

    const { elems } = params.query;

    if (!elems) return makeError(400, 'Bad action');

    const valid = player.elems.every(
      (x, i) => elems[i].type === x.type === elems[i].amount <= x.amount,
    );

    if (!valid) return makeError(400, 'Element amount invalid');

    player.elems.forEach((x, i) => x.selected = elems[i].amount);
    game.exchange = { requester: { uid: _id, name, elems }, responses: [] };

    return this.next(game, GameStatus.Exchange);
  }

  reply(game: Game, params: GamesParams) {
    if (!game.exchange) return makeError(400, 'Bad action');

    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id, name } = connection.user;
    const player = game.players.get(_id);

    if (!player) return makeError(404, 'Player not found');

    const { elems } = params.query;

    if (!elems) return makeError(400, 'Bad action');

    const valid = player.elems.every(
      (x, i) => elems[i].type === x.type === elems[i].amount <= x.amount,
    );

    if (!valid) return makeError(400, 'Element amount invalid');

    player.elems.forEach((x, i) => x.selected = elems[i].amount);
    game.exchange.responses.push({ uid: _id, name, elems });

    return this.makeResult('refreshed', game);
  }

  regret(game: Game, params: GamesParams) {
    if (!game.exchange) return makeError(400, 'Bad action');

    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id } = connection.user;
    const player = game.players.get(_id);

    if (!player) return makeError(404, 'Player not found');

    const index = game.exchange.responses.findIndex(x => x.uid === _id);

    if (index === -1) return makeError(400, 'Bad action');

    player.elems.forEach(x => x.selected = 0);
    game.exchange.responses.splice(index, 1);

    return this.makeResult('refreshed', game);
  }

  accept(game: Game, params: GamesParams) {
    const { action, exchange } = game;
    const { target } = params.query;

    if (!action || !exchange || !target) return makeError(400, 'Bad action');

    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id } = connection.user;
    const requester = game.players.get(_id);
    const responder = game.players.get(target);

    if (!requester || !responder) return makeError(404, 'Player not found');

    requester.elems.forEach((x, i) => {
      x.amount += responder.elems[i].selected;
      x.amount -= requester.elems[i].selected;
    });

    responder.elems.forEach((x, i) => {
      x.amount += requester.elems[i].selected;
      x.amount -= responder.elems[i].selected;
    });

    requester.elems.forEach(x => x.selected = 0);
    responder.elems.forEach(x => x.selected = 0);

    requester.exchanges -= 1;
    action.step = Steps.Cast;
    game.exchange = null;

    return [
      this.makeResult('assigned', game, {
        receiver: requester.uid, player: toMyPlayerJSON(requester),
      }),
      this.makeResult('assigned', game, {
        receiver: responder.uid, player: toMyPlayerJSON(responder),
      }),
      this.next(game, GameStatus.Wait),
    ];
  }

  cast(game: Game, params: GamesParams) {
    const { connection } = params;

    if (!connection) return makeError(401, 'Empty connection instance');

    const { _id } = connection.user;
    const me = game.players.get(_id);

    if (!me) return makeError(404, 'Player not found');
    if (!me.actions) return makeError(400, 'No action points');

    const { action } = game;

    if (!action) return makeError(400, 'Action not assigned');

    const { spell: type } = params.query;

    if (!type) return makeError(400, 'Spell type is empty');

    const spell = useSpellHelper({
      type,
      elems: me.elems,
      spells: this.config.spells,
    });

    if (!spell.valid()) return makeError(400, 'Invalid spell type');

    if (!spell.sufficient()) {
      return makeError(400, 'Insufficient number of elements');
    }

    spell.cast();
    me.actions -= 1;

    if (type === 'peek') return this.peek(game, me);

    const { weight } = this.config.cards;
    const [card] = CardDeck.draw(1, weight[type]);

    // Delay the update of cards
    setTimeout(() => me.cards.push(card), 0);

    return [
      this.makeResult('casted', game, { receiver: _id, card }),
      this.makeResult('assigned', game, {
        receiver: me.uid,
        player: toMyPlayerJSON(me),
      }),
    ];
  }

  peek(game: Game, requester: GamePlayer) {
    const others = toArray(game.players).filter(x => x.uid !== requester.uid);
    const index = random(0, others.length - 1);
    const target = others[index];
    return [
      this.makeResult('peeked', game, {
        receiver: requester.uid,
        target: pick(target, ['uid', 'name', 'team']),
      }),
      this.makeResult('assigned', game, {
        receiver: requester.uid,
        player: toMyPlayerJSON(requester),
      }),
    ];
  }

  enchant(game: Game, params: GamesParams) {
    const { connection } = params;

    if (!connection) return makeError(401, 'Empty connection instance');

    const { _id } = connection.user;
    const me = game.players.get(_id);

    if (!me) return makeError(404, 'Player not found');

    const { card, target } = params.query;

    if (!card) return makeError(400, 'Card ID is not assigned');
    if (!CardDeck.map[card]) return makeError(400, 'Incorrect card ID');
    if (!me.cards.find(x => x.id === card)) return makeError(404, 'Card not found');

    const isEnhance = CardDeck.isEnhance(card);
    const isAttack = CardDeck.isAttack(card);
    const isHeal = CardDeck.isHeal(card);
    const isBuff = CardDeck.isBuff(card);

    if (isEnhance) return this.enhance(game, me, card);
    if (isHeal) return this.heal(game, me, card);

    if (!target) return makeError(400, 'Target is not assigned');

    const opponent = game.players.get(target);

    if (!opponent) return makeError(404, 'Target player not found');

    if (isAttack) return this.attack(game, me, opponent, card);
    if (isBuff) return this.affect(game, me, opponent, card);

    return makeError(400, 'Card type not defined');
  }

  enhance(game: Game, player: GamePlayer, card: string) {
    const { attributes } = CardDeck.map[card];

    if (!attributes) return;

    const { strength, defense } = attributes;

    strength && (player.strength += strength as number);
    defense && (player.defense += defense as number);

    CardDeck.remove(player.cards, card);

    return this.makeResult('assigned', game, {
      receiver: player.uid,
      player: toMyPlayerJSON(player),
    });
  }

  heal(game: Game, player: GamePlayer, card: string) {
    const { attributes = {} } = CardDeck.map[card];
    const { energy = 0 } = attributes;
    const { team1, team2 } = game;
    const team = player.team === 1 ? team1 : team2;

    team.energy += energy;

    CardDeck.remove(player.cards, card);

    return [
      this.makeResult('healed', game, { receiver: player.uid, energy }),
      this.makeResult('assigned', game, {
        receiver: player.uid,
        player: toMyPlayerJSON(player),
      }),
    ];
  }

  attack(game: Game, player: GamePlayer, target: GamePlayer, card: string) {
    const buffs1 = useBuffHelper({ buffs: player.buffs });
    const buffs2 = useBuffHelper({ buffs: target.buffs });

    if (buffs1.has('B001') || buffs2.has('B002')) {
      buffs1.remove('B001');
      buffs2.remove('B002');
      CardDeck.remove(player.cards, card);
      return this.attacked(game, player, 0);
    }

    const { team1, team2 } = game;
    const team = target.team === 1 ? team1 : team2;

    const attack = resolveAttack(player, card);
    const defense = target.defense;
    const attacked = attack > defense ? attack - defense : 0;

    player.attack += attacked;
    target.attacked += attacked;
    team.energy -= attacked;

    CardDeck.remove(player.cards, card);

    return this.attacked(game, player, attacked);
  }

  attacked(game: Game, player: GamePlayer, attacked: number) {
    return [
      this.makeResult('attacked', game, { receiver: player.uid, attacked }),
      this.makeResult('assigned', game, {
        receiver: player.uid,
        player: toMyPlayerJSON(player),
      }),
    ];
  }

  affect(game: Game, player: GamePlayer, target: GamePlayer, card: string) {
    target.buffs.push(card);
    CardDeck.remove(player.cards, card);

    return [
      this.makeResult('affected', game, {
        receiver: target.uid,
        spellcaster: toPlayerJSON(player),
      }),
      this.makeResult('assigned', game, {
        receiver: player.uid,
        player: toMyPlayerJSON(player),
      }),
    ];
  }

  move(game: Game, params: GamesParams) {
    const { action } = game;

    if (!action) return makeError(400, 'Bad action');

    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id } = connection.user;

    if (action.uid !== _id) return makeError(400, 'Bad action');

    const player = game.players.get(_id);

    if (!player) return makeError(404, 'Player not found');

    action.moves = random(1, 6);
    action.moved = true;

    return [
      this.makeResult('move', game),
      this.next(game, GameStatus.Move),
    ];
  }

  moved(id: string) {
    const game = this.map.get(id);

    if (!game) return makeError(404, 'Game not found');

    const { action } = game;

    if (!action) return makeError(400, 'Bad action');

    action.moves = 0;

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
      return makeError(401, 'Empty connection instance');
    }

    const { _id } = connection.user;

    if (confirmed.has(_id)) {
      return makeError(400, 'Bad action');
    }

    confirmed.add(_id);

    const result: Promise<any>[] = [
      this.makeResult('confirmed', game, { receiver: _id }),
    ];

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

  leave(game: Game, params: GamesParams) {
    const { connection } = params;

    if (!connection) {
      return makeError(401, 'Empty connection instance');
    }

    const { _id: uid } = connection.user;
    const { team1, team2, sequence, players, action, exchange } = game;

    if (!players.has(uid)) makeError(400, 'Bad action');

    const index1 = team1.players.findIndex(x => x.uid === uid);
    const index2 = team2.players.findIndex(x => x.uid === uid);
    const index3 = sequence.indexOf(uid);
    const index4 = exchange?.responses.findIndex(x => x.uid === uid);

    index1 > -1 && team1.players.splice(index1, 1);
    index2 > -1 && team2.players.splice(index2, 1);
    index4 && index4 > -1 && exchange?.responses.splice(index2, 1);
    sequence.splice(index3, 1);
    players.delete(uid);

    if (action && action.uid === uid) {
      return this.rotate(game);
    }

    return this.makeResult('refreshed', game);
  }

  destroy(room: string) {
    if (!room) {
      return makeError(400, 'Bad request');
    }

    const game = this.list.find(x => x.room === room);

    if (!game) {
      return makeError(404, 'Instance not found');
    }

    this.map.delete(game.id);

    return this.makeResult('destroyed', null, { id: game.id });
  }

  makeGame(room: RoomJSON): Game {
    const id = Math.random().toString(16).slice(2);
    const colors = this.makePlayColors(room.players.length);
    const players = room.players.map((x, i) => this.makePlayer(x, colors[i]));
    const { team1, team2 } = this.makeTeams(players);
    const sequence = players.map(x => x.uid).sort(() => Math.random() - .5);
    return {
      id,
      room: room.id,
      status: GameStatus.Ready,
      map: useGameMapHelper(players.length).make(),
      team1,
      team2,
      sequence,
      players: new Map(players.map(x => [x.uid, x])),
      collected: new Set(),
      confirmed: new Set(),
      round: 1,
      dice1: 0,
      dice2: 0,
      action: null,
      exchange: null,
    };
  }

  makeTeams(players: GamePlayers) {
    const { team } = this.config;
    const length = players.length;
    const half = halfOf(length, 'random');
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

  makePlayColors(length: number): number[] {
    const colors = range(1, 11).sort(() => Math.random() - .5);
    return colors.slice(0, length);
  }

  makePlayer(player: Player, color: number): GamePlayer {
    const { strength, defense } = this.config.player;
    return {
      ...player,
      team: 0,
      color,
      strength,
      defense,
      elems: this.makePlayerElems(),
      cards: this.makePlayerCards(),
      buffs: [],
      exchanges: 3,
      actions: 3,
      attack: 0,
      attacked: 0,
    };
  }

  makePlayerElems(): Elems {
    const { initial, range } = this.config.elems;
    const [min, max] = range;
    const numbers = [0, 0, 0].map(() => random(min, max));
    const total = numbers.reduce((v, x) => v + x, 0);
    const amounts = [...numbers, initial - total].sort(() => Math.random() - .5);
    return amounts.map((x, i) => ({ type: i + 1, amount: x, selected: 0 }));
  }

  makePlayerCards(): Cards {
    return CardDeck.draw(this.config.cards.initial);
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
      // players: toArray(players),
      ...omit(game, ['players', 'team1', 'team2']),
      team1: pick(team1, ['energy']),
      team2: pick(team2, ['energy']),
      players: toArray(players).map(toPlayerJSON),
      collected: Array.from(collected),
      confirmed: Array.from(confirmed),
    };
  }

  get list(): Game[] {
    return toArray(this.map);
  }

  get config() {
    return this.app.get('game');
  }
}
