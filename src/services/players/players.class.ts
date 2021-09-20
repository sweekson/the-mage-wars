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
  elems: Elem[];
  cards: Card[];
  attacked: number;
  isAdmin: boolean;
}

export type Players = Player[];
