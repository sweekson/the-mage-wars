import { Application } from '../../declarations';
import { Cards } from '../cards/cards.class';
import { makeResult } from '../../utils/common';

export interface Elem {
  type: number;
  amount: number;
  selected: number;
}

export type Elems = Elem[];

export interface ExchangingElem {
  type: number;
  amount: number;
}

export type ExchangingElems = ExchangingElem[];

export interface Spell {
  type: string;
  costs: Elems;
}

export type Spells = Spell[];

export interface Player {
  index: number;
  uid: string;
  name: string;
  isAdmin: boolean;
}

export type Players = Player[];

export interface GamePlayer extends Player {
  team: number;
  color: number;
  position: number;
  strength: number;
  defense: number;
  elems: Elems;
  cards: Cards;
  buffs: string[];
  exchanges: number;
  actions: number;
  attack: number;
  attacked: number;
}

export type GamePlayers = GamePlayer[];

export type Buffs = Pick<GamePlayer, 'buffs'>;

export interface ExchangingPlayer {
  uid: string;
  name: string;
  elems: ExchangingElems;
}

export class PlayersService {
  app: Application;
  events: string[];

  constructor(options: any, app: Application) {
    this.app = app;
    this.events = ['refreshed'];
  }

  async find() {
    const list = this.app.channel('authenticated').connections.map(
      ({ user }) => ({ uid: user._id, name: user.name }),
    );
    return makeResult('refreshed', { list });
  }
}
