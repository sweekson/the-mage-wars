
export interface Card {
  id: string;
  name: string;
  description: string;
}

export type Cards = Card[];

export interface CardAttributes {
  [key: string]: string | number;
}

export interface CardDefinition extends Card {
  icon: string;
  level: number;
  weight: number;
  attributes?: CardAttributes;
}

export type CardDefinitions = CardDefinition[];
