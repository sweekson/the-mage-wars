import { Application } from '../../declarations';
import { makeResult } from '../../utils/common';

export interface Elem {
  type: string;
  amount: string;
}

export type Elems = Elem[];

export interface Card {
  id: string;
  name: string;
}

export type Cards = Card[];

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
  strength: number;
  defense: number;
  elems: Elem[];
  cards: Card[];
  actions: number;
  attack: number;
  attacked: number;
}

export type GamePlayers = GamePlayer[];

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
