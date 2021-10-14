import keyBy from 'lodash/keyBy';

import { CardDefinitions } from './cards.class';

// A = Attack
// A0: Nornal Attack
// A1: Direct Attack (Ignore Defense)

// E = Enhance
// E1: Strength (self)
// E2: Defense (self)

// B = Buff
// B0: Immunity
// B1: Weaken
// B2: Enhance

// H = Heal
// H0: Heal

export const GameCards: CardDefinitions = [
  {
    id: 'A001',
    name: 'Cactus',
    description: 'Throw a cactus and cause ${percent}% damage',
    icon: 'cactus',
    level: 3,
    weight: 1200,
    attributes: {
      percent: 100,
    },
  },
  {
    id: 'A002',
    name: 'Waterball',
    description: 'Throw a waterball and cause ${percent}% damage',
    icon: 'vile-fluid',
    level: 3,
    weight: 1000,
    attributes: {
      percent: 120,
    },
  },
  {
    id: 'A003',
    name: 'Thunderball',
    description: 'Summon a thunderball and cause ${percent}% damage',
    icon: 'thunderball',
    level: 2,
    weight: 400,
    attributes: {
      percent: 150,
    },
  },
  {
    id: 'A004',
    name: 'Billow',
    description: 'Summon a billow and cause ${percent}% damage',
    icon: 'big-wave',
    level: 1,
    weight: 350,
    attributes: {
      percent: 160,
    },
  },
  {
    id: 'A005',
    name: 'Bolide',
    description: 'Summon bolide and cause ${percent}% damage',
    icon: 'thrown-charcoal',
    level: 1,
    weight: 150,
    attributes: {
      percent: 200,
    },
  },
  {
    id: 'E101',
    name: 'Rage I',
    description: 'Increase strength by ${strength}',
    icon: 'fire-silhouette',
    level: 3,
    weight: 1200,
    attributes: {
      strength: 5,
    },
  },
  {
    id: 'E102',
    name: 'Rage II',
    description: 'Increase strength by ${strength}',
    icon: 'fire-silhouette',
    level: 2,
    weight: 500,
    attributes: {
      strength: 10,
    },
  },
  {
    id: 'E103',
    name: 'Rage III',
    description: 'Increase strength by ${strength}',
    icon: 'fire-silhouette',
    level: 1,
    weight: 200,
    attributes: {
      strength: 15,
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
      defense: 5,
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
      defense: 10,
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
      defense: 15,
    },
  },
  {
    id: 'B001',
    name: 'Null',
    description: 'Nullify the target\'s next attack',
    icon: 'vortex',
    level: 1,
    weight: 50,
  },
  {
    id: 'B002',
    name: 'Immunity',
    description: 'The specified target will be immune to damage once',
    icon: 'icicles-aura',
    level: 1,
    weight: 50,
  },
  {
    id: 'B101',
    name: 'Curse I',
    description: 'Reduce a target\'s next attack by ${percent}%',
    icon: 'death-note',
    level: 3,
    weight: 800,
    attributes: {
      percent: 20,
    },
  },
  {
    id: 'B102',
    name: 'Curse II',
    description: 'Reduce a target\'s next attack by ${percent}%',
    icon: 'death-note',
    level: 2,
    weight: 400,
    attributes: {
      percent: 40,
    },
  },
  {
    id: 'B103',
    name: 'Curse III',
    description: 'Reduce a target\'s next attack by ${percent}%',
    icon: 'death-note',
    level: 1,
    weight: 150,
    attributes: {
      percent: 60,
    },
  },
  {
    id: 'B201',
    name: 'Critical Hit I',
    description: 'Increase a target\'s next attack by ${percent}%',
    icon: 'middle-arrow',
    level: 3,
    weight: 800,
    attributes: {
      percent: 20,
    },
  },
  {
    id: 'B202',
    name: 'Critical Hit II',
    description: 'Increase a target\'s next attack by ${percent}%',
    icon: 'middle-arrow',
    level: 2,
    weight: 400,
    attributes: {
      percent: 40,
    },
  },
  {
    id: 'B203',
    name: 'Critical Hit III',
    description: 'Increase a target\'s next attack by ${percent}%',
    icon: 'middle-arrow',
    level: 1,
    weight: 150,
    attributes: {
      percent: 60,
    },
  },
  {
    id: 'H001',
    name: 'Heal I',
    description: 'Summon healing to recover the energy of my camp by ${energy}',
    icon: 'caduceus',
    level: 3,
    weight: 800,
    attributes: {
      energy: 30,
    },
  },
  {
    id: 'H002',
    name: 'Heal II',
    description: 'Summon healing to recover the energy of my camp by ${energy}',
    icon: 'caduceus',
    level: 2,
    weight: 350,
    attributes: {
      energy: 80,
    },
  },
  {
    id: 'H003',
    name: 'Heal II',
    description: 'Summon healing to recover the energy of my camp by ${energy}',
    icon: 'caduceus',
    level: 1,
    weight: 200,
    attributes: {
      energy: 120,
    },
  },
];

export const GameCardMap = keyBy(GameCards, 'id');
