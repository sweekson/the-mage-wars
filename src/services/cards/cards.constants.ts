import keyBy from 'lodash/keyBy';

import { CardDefinitions } from './cards.class';

export const CardTypeMap = {
  common: {
    costs: [
      { type: 1, amount: 2 },
      { type: 2, amount: 4 },
      { type: 3, amount: 3 },
      { type: 4, amount: 2 },
    ],
  },
  advanced: {
    costs: [
      { type: 1, amount: 6 },
      { type: 2, amount: 5 },
      { type: 3, amount: 5 },
      { type: 4, amount: 7 },
    ],
  },
  peek: {
    costs: [
      { type: 1, amount: 10 },
      { type: 2, amount: 10 },
      { type: 3, amount: 10 },
      { type: 4, amount: 10 },
    ],
  },
};

// A = Attack
// A0: Attack

// E = Enhance
// E1: Strength (self)
// E2: Defense (self)

// B = Buff
// B0: Immunity
// B1: Weaken
// B2: Strengthen

export const GameCards: CardDefinitions = [
  {
    id: 'A001',
    name: 'Waterball',
    description: 'Attack a specified target once',
    icon: 'vile-fluid',
    level: 3,
    weight: 1200,
  },
  {
    id: 'A002',
    name: 'Thunderball',
    description: 'Attack a specified target with ${multiples} times the strength',
    icon: 'thunderball',
    level: 2,
    weight: 400,
    attributes: {
      multiples: 1.5,
    },
  },
  {
    id: 'A003',
    name: 'Meteor',
    description: 'Attack a specified target with ${multiples} times the strength',
    icon: 'thrown-charcoal',
    level: 1,
    weight: 150,
    attributes: {
      multiples: 2,
    },
  },
  {
    id: 'E101',
    name: 'Strengthen I',
    description: 'Increase strength by ${strength}',
    icon: 'muscle-up',
    level: 3,
    weight: 1200,
    attributes: {
      strength: 2,
    },
  },
  {
    id: 'E102',
    name: 'Strengthen II',
    description: 'Increase strength by ${strength}',
    icon: 'muscle-up',
    level: 2,
    weight: 500,
    attributes: {
      strength: 5,
    },
  },
  {
    id: 'E103',
    name: 'Strengthen III',
    description: 'Increase strength by ${strength}',
    icon: 'muscle-up',
    level: 1,
    weight: 200,
    attributes: {
      strength: 10,
    },
  },
  {
    id: 'E201',
    name: 'Shield I',
    description: 'Increase defense by ${defense}',
    icon: 'eye-shield',
    level: 3,
    weight: 1200,
    attributes: {
      defense: 2,
    },
  },
  {
    id: 'E202',
    name: 'Shield II',
    description: 'Increase defense by ${defense}',
    icon: 'eye-shield',
    level: 2,
    weight: 500,
    attributes: {
      defense: 5,
    },
  },
  {
    id: 'E203',
    name: 'Shield III',
    description: 'Increase defense by ${defense}',
    icon: 'eye-shield',
    level: 1,
    weight: 200,
    attributes: {
      defense: 10,
    },
  },
  {
    id: 'B001',
    name: 'Immunity',
    description: 'The specified target will be immune to damage once',
    icon: 'icicles-aura',
    level: 1,
    weight: 50,
  },
  {
    id: 'B002',
    name: 'Null',
    description: 'Nullify the target\'s next attack',
    icon: 'vortex',
    level: 1,
    weight: 50,
  },
  {
    id: 'B101',
    name: 'Curse I',
    description: 'Reduce a target\'s next attack power by ${decrement}%',
    icon: 'death-note',
    level: 3,
    weight: 800,
    attributes: {
      decrement: 20,
    },
  },
  {
    id: 'B102',
    name: 'Curse II',
    description: 'Reduce a target\'s next attack power by ${decrement}%',
    icon: 'death-note',
    level: 2,
    weight: 400,
    attributes: {
      decrement: 40,
    },
  },
  {
    id: 'B103',
    name: 'Curse III',
    description: 'Reduce a target\'s next attack power by ${decrement}%',
    icon: 'death-note',
    level: 1,
    weight: 150,
    attributes: {
      decrement: 60,
    },
  },
  {
    id: 'B201',
    name: 'Critical Hit I',
    description: 'Increase a target\'s next attack power by ${increment}%',
    icon: 'middle-arrow',
    level: 3,
    weight: 800,
    attributes: {
      increment: 20,
    },
  },
  {
    id: 'B202',
    name: 'Critical Hit II',
    description: 'Increase a target\'s next attack power by ${increment}%',
    icon: 'middle-arrow',
    level: 2,
    weight: 400,
    attributes: {
      increment: 40,
    },
  },
  {
    id: 'B203',
    name: 'Critical Hit III',
    description: 'Increase a target\'s next attack power by ${increment}%',
    icon: 'middle-arrow',
    level: 1,
    weight: 150,
    attributes: {
      increment: 60,
    },
  },
];

export const GameCardMap = keyBy(GameCards, 'id');
