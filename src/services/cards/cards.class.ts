
export interface Card {
  id: string;
  name: string;
  description: string;
}

export type Cards = Card[];

export interface CardAttributes {
  strength?: number;
  defense?: number;
  percent?: number;
  energy?: number;
}

export interface CardDefinition extends Card {
  icon: string;
  level: number;
  weight: number;
  attributes?: CardAttributes;
}

export type CardDefinitions = CardDefinition[];
