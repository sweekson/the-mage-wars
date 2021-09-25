import { Application } from '../../declarations';
import { makeResult } from '../../utils/common';

export interface Elem {
  id: string;
  type: string;
  count: string;
}

export interface Card {
  id: string;
  name: string;
}

export interface Player {
  index: number;
  uid: string;
  name: string;
  team?: number;
  strength?: number;
  defense?: number;
  elems?: Elem[];
  cards?: Card[];
  attack?: number;
  attacked?: number;
  isAdmin: boolean;
}

export type Players = Player[];

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
