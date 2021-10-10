import { ref, computed } from 'vue';
import template from 'lodash/template';

import { pipe } from '../utils/common';

export const CardIconColorMap = {
  'vile-fluid': 'cyan',
  'thunderball': 'yellow',
  'thrown-charcoal': 'red',
  'muscle-up': 'volcano',
  'eye-shield': 'green',
  'icicles-aura': 'white',
  'vortex': 'silver',
  'death-note': 'purple',
  'middle-arrow': 'magenta',
};

export const resolveCardIconColor = (card) => {
  return Object.assign(card, { color: CardIconColorMap[card.icon] });
};

export const resolveCardDescription = (card) => {
  const compiled = template(card.description);
  const description = compiled(card.attributes);
  return Object.assign(card, { description });
};

export const resolveCardsPosition = (cards) => {
  const length = cards.length;
  const half1 = Math.floor(length * .5);
  const half2 = Math.ceil(length * .5);
  return cards.map((card, index) => {
    const shiftX1 = 70 * index;
    const shiftX2 = 70 * length * .5 - 35;
    const shiftY1 = -4 * (index < half2 ? index : length - index - 1);
    const shiftY2 = shiftY1 - 380;
    const degree = -2 * (half1 - index);
    const position1 = `translate(${shiftX1}px, ${shiftY1}px) rotateZ(${degree}deg)`;
    const position2 = `translate(${shiftX2}px, ${shiftY2}px)`;
    return Object.assign(card, { position1, position2 });
  });
};

export const resolveCardProps = pipe(
  resolveCardIconColor,
  resolveCardDescription,
);

export const resolveCardsProps = (cards) => cards.map(resolveCardProps);

export const useGameCards = ({ action, me }) => {
  const list = computed(() => me.value.cards || []);
  const selected = ref(null);
  const isCastable = computed(
    () => action.isMine.value && !action.isPray.value && !!selected.value,
  );
  const onSelect = card => {
    selected.value = selected.value === card ? null : card;
  };

  return {
    list,
    selected,
    isCastable,
    onSelect,
  };
};
