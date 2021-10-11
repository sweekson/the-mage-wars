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
    const shiftY2 = shiftY1 - 350;
    const degree = -2 * (half1 - index);
    const position1 = `translate(${shiftX1}px, ${shiftY1}px) rotateZ(${degree}deg)`;
    const position2 = `translate(${shiftX2}px, ${shiftY2}px)`;
    return Object.assign(card, { position1, position2 });
  });
};

export const resolveCardsSorting = (cards) => {
  return cards.sort((a, b) => a.id.localeCompare(b.id));
};

export const resolveCardProps = pipe(
  resolveCardIconColor,
  resolveCardDescription,
);

export const resolveCardsProps = (cards) => cards.map(resolveCardProps);

export const useGameCards = ({ client, current, action, me }) => {
  const { GamesAPI } = client;
  const list = computed(() => me.value.cards || []);
  const selected = ref(null);
  const target = ref('');
  const isCastable = computed(
    () => action.isMine.value && !action.isPray.value && !!selected.value,
  );
  const isEnchantable = computed(
    () => !!selected.value && !!target.value,
  );
  const isPlayerSelectionOpen = ref(false);
  const isAttackCardSelected = computed(
    () => selected.value && /^A/.test(selected.value.id),
  );
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onSelect = card => {
    selected.value = selected.value === card ? null : card;
  };
  const onEnchant = () => {
    const { id } = selected.value;
    const isEnhance = /^E/.test(id);
    if (isEnhance) return update({ enchant: true, card: id });
    isPlayerSelectionOpen.value = true;
  };
  const onPlayerSelect = (uid) => (target.value = uid);
  const onPlayerSelectConfirm = () => {
    isPlayerSelectionOpen.value = false;
    return update({
      enchant: true,
      card: selected.value.id,
      target: target.value,
    });
  };
  const onPlayerSelectCancel = () => {
    target.value = '';
    isPlayerSelectionOpen.value = false;
  };

  GamesAPI.on('assigned', () => (selected.value = null));
  GamesAPI.on('attacked', () => (target.value = ''));

  return {
    list,
    selected,
    target,
    isCastable,
    isEnchantable,
    isPlayerSelectionOpen,
    isAttackCardSelected,
    onSelect,
    onEnchant,
    onPlayerSelect,
    onPlayerSelectConfirm,
    onPlayerSelectCancel,
  };
};
