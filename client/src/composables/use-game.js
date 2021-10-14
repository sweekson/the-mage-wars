import { ref, computed, watch } from 'vue';

import { Emitter } from '../models/emitter.class';
import { resolveElemsProps } from '@composables/use-game-elems';
import {
  useGameCards,
  resolveCardProps, resolveCardsProps,
  resolveCardsPosition, resolveCardsSorting,
} from '@composables/use-game-cards';
import { useGameMap } from '@composables/use-game-map';

const useGameStatus = ({ auth, current }) => {
  const Status = {
    Pray: 'pray',
    Collect: 'collect',
    Exchange: 'exchange',
    Cast: 'cast',
    Move: 'move',
    Confirm: 'confirm',
  };
  const status = computed(() => current.value?.status);
  const isPray = computed(() => status.value === Status.Pray);
  const isCollect = computed(() => status.value === Status.Collect);
  const isCollected = computed(
    () => current.value.collected.includes(auth.uid),
  );
  const isExchange = computed(() => status.value === Status.Exchange);
  const isCast = computed(() => status.value === Status.Cast);
  const isMove = computed(() => status.value === Status.Move);
  const isConfirm = computed(() => status.value === Status.Confirm);
  const isConfirmed = computed(
    () => current.value.confirmed.includes(auth.uid),
  );
  return {
    isPray,
    isCollect,
    isCollected,
    isExchange,
    isCast,
    isMove,
    isConfirm,
    isConfirmed,
  };
};

const useGameAction = ({ client, auth, current, status, me }) => {
  const { GamesAPI } = client;
  const Steps = {
    Pray: 1,
    Exchange: 2,
    Cast: 3,
    Move: 4,
  };
  const action = computed(() => current.value.action || {});
  const isMine = computed(() => action.value.uid === auth.uid);
  const isPray = computed(() => action.value.step === Steps.Pray);
  const isPrayable = computed(
    () => isMine.value && isPray.value && !status.isPray.value,
  );
  const isExchangeable = computed(
    () => isMine.value && !isPray.value && me.value.exchanges > 0,
  );
  const isCastable = computed(
    () => isMine.value && !isPray.value && me.value.actions > 0,
  );
  const isMoveable = computed(
    () => isMine.value && !isPray.value && !action.value.moved
  );
  const isPassable = computed(
    () => isMine.value && !isPray.value && action.value.moved
  );
  const isPassing = ref(false);
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onPray = () => update({ pray: true });
  const onCollect = () => update({ collect: true });
  const onMove = () => update({ move: true });
  const onPass = () => {
    update({ rotate: true });
    isPassing.value = false;
  };
  const onTryPass = () => {
    if (!me.value.actions) return onPass();
    isPassing.value = true;
  };
  const onConfirm = () => update({ confirm: true });
  const onRemove = () => GamesAPI.remove(current.value.id);
  const onLeave = () => {
    // A game will be deleted automatically when the last player left
    // So leaving from a deleted game will return 400 error
    update({ leave: true }).catch(e => e.code !== 400 && console.warn(e));
  };

  return {
    isMine,
    isPray,
    isPrayable,
    isExchangeable,
    isCastable,
    isMoveable,
    isPassable,
    isPassing,
    onPray,
    onCollect,
    onMove,
    onPass,
    onTryPass,
    onConfirm,
    onRemove,
    onLeave,
  };
};

const useGameElemsExchange = ({ client, current, status, me }) => {
  const { GamesAPI } = client;
  const requester = computed(() => {
    if (!current.value || !current.value.exchange) return null;
    const { requester } = current.value.exchange;
    if (!requester) return null;
    resolveElemsProps(requester.elems);
    return requester;
  });
  const responses = computed(() => {
    if (!current.value || !current.value.exchange) return [];
    const { responses } = current.value.exchange;
    if (!responses) return [];
    responses.forEach(x => resolveElemsProps(x.elems));
    return responses;
  });
  const selected = ref(null);
  const isOpen = ref(status.isExchange.value);
  const isSendable = computed(() => me.value.elems.some(x => x.selected > 0));
  const isAcceptable = computed(() => selected.value !== null);
  const isReplied = computed(
    () => !!responses.value.find(x => x.uid === me.value.uid),
  );
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onOpen = () => isOpen.value = true;
  const onClose = () => {
    me.value.elems.forEach(x => (x.selected = 0));
    isOpen.value = false;
  };
  const onUpdate = (type, selected) => {
    const elem = me.value.elems.find(x => x.type === type);
    if (!elem) return;
    elem.selected = selected;
  };
  const onSend = () => update({
    exchange: true,
    elems: me.value.elems.map(x => ({ type: x.type, amount: x.selected })),
  });
  const onReply = () => update({
    reply: true,
    elems: me.value.elems.map(x => ({ type: x.type, amount: x.selected })),
  });
  const onRegret = () => update({ regret: true });
  const onSelect = uid => (selected.value = uid);
  const onAccept = () => {
    update({ accept: true, target: selected.value }).then(() => onClose());
  };
  const onCancel = () => update({ cancel: true });
  const onReject = () => status.isExchange.value ? onCancel() : onClose();

  watch(status.isExchange, x => !isOpen.value && (isOpen.value = x));
  watch(responses, () => {
    if (responses.value.find(x => x.uid === selected.value)) return;
    selected.value = null;
  });

  GamesAPI.on('rotated', () => (isOpen.value = false));

  return {
    requester,
    responses,
    selected,
    isOpen,
    isSendable,
    isAcceptable,
    isReplied,
    onOpen,
    onUpdate,
    onSend,
    onReply,
    onRegret,
    onSelect,
    onAccept,
    onReject,
  };
};

const useGameCastSpell = ({ client, current, me }) => {
  const { GamesAPI } = client;
  const spells = [
    {
      type: 'common',
      icon: 'orb-wand',
      description: `
        Randomly cast a spell. You'll get a card that you can use later.
        There is a lower chance to get an advanced card.
      `,
      costs: [
        { type: 1, amount: 2 },
        { type: 2, amount: 4 },
        { type: 3, amount: 3 },
        { type: 4, amount: 2 },
      ],
    },
    {
      type: 'advanced',
      icon: 'gift-of-knowledge',
      description: `
        Randomly cast a advanced spell.
        You will definitely get an advanced card that you can use later.
      `,
      costs: [
        { type: 1, amount: 6 },
        { type: 2, amount: 5 },
        { type: 3, amount: 5 },
        { type: 4, amount: 7 },
      ],
    },
    {
      type: 'peek',
      icon: 'cowled',
      description: 'Randomly check the camp of a player.',
      costs: [
        { type: 1, amount: 10 },
        { type: 2, amount: 10 },
        { type: 3, amount: 10 },
        { type: 4, amount: 10 },
      ],
    },
  ];
  const selected = ref(null);
  const casted = ref(null);
  const peeked = ref(null);
  const isOpen = ref(false);
  const isCasted = computed(() => !!casted.value);
  const isPeeked = computed(() => !!peeked.value);
  const isSendable = computed(() => {
    if (!selected.value) return false;
    const { costs } = selected.value;
    const { elems } = me.value;
    return elems.every((x, i) => x.amount >= costs[i].amount);
  });
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onOpen = () => isOpen.value = true;
  const onCancel = () => {
    selected.value = null;
    isOpen.value = false;
  };
  const onSelect = (spell) => (selected.value = spell);
  const onSend = () => {
    update({ cast: true, spell: selected.value.type }).then(() => onCancel());
  };
  const onCasted = ({ card }) => {
    casted.value = resolveCardProps(card);
  };
  const onPeeked = ({ target }) => (peeked.value = target);
  const onCastedConfirm = () => {
    me.value.cards.push(casted.value);
    resolveCardsProps(me.value.cards);
    resolveCardsSorting(me.value.cards);
    resolveCardsPosition(me.value.cards);
    casted.value = null;
  };
  const onPeekedConfirm = () => {
    peeked.value = null;
  };

  spells.forEach(x => resolveElemsProps(x.costs));

  GamesAPI.on('casted', onCasted);
  GamesAPI.on('peeked', onPeeked);

  return {
    spells,
    selected,
    casted,
    peeked,
    isOpen,
    isCasted,
    isPeeked,
    isSendable,
    onOpen,
    onCancel,
    onSelect,
    onSend,
    onCastedConfirm,
    onPeekedConfirm,
  };
};

export const useGame = ({ client, auth, room, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const { GamesAPI } = client;
  const current = ref(null);
  const me = ref({});
  const status = useGameStatus({ auth, current });
  const action = useGameAction({ client, auth, current, status, me });
  const exchange = useGameElemsExchange({ client, current, status, me });
  const cast = useGameCastSpell({ client, current, status, me });
  const cards = useGameCards({ client, current, status, action, me });
  const map = useGameMap({ client, current });
  const isReady = ref(false);
  const isDiceStop = ref(false);
  const find = (query) => GamesAPI.find({ query });
  const onRoomJoined = ({ detail }) => {
    detail.isStarted && find({ room: detail.id });
  };
  const onRoomLeft = () => {
    logger.info('game:reset');
    current.value = null;
    isReady.value = false;
  };
  const onLoaded = ({ game }) => {
    logger.info('game:loaded', game?.status, game?.action?.step);
    find({ id: game.id, assigned: true });
    current.value = game;
    isReady.value = true;
    emitter.emit('ready');
    console.log('game', current.value);
  };
  const onAssigned = ({ player }) => {
    logger.info('game:assigned', player.team);
    resolveElemsProps(player.elems);
    resolveCardsProps(player.cards);
    resolveCardsSorting(player.cards);
    resolveCardsPosition(player.cards);
    Object.assign(me.value, player);
    console.log('me', me.value);
  };
  const onRefreshed = ({ game }) => {
    logger.info('game:refreshed', game.status, game.action?.step);
    current.value = game;
    console.log('game', current.value);
  };
  const onRotated = ({ game }) => {
    logger.info('game:rotated', game.action.uid);
    isDiceStop.value = false;
    emitter.emit('rotated');
  };
  const onDiceStop = () => setTimeout(() => isDiceStop.value = true, 350);
  const onAttacked = ({ attacked }) => {
    emitter.emit('attacked', { attacked });
  };
  const onHealed = ({ energy }) => {
    emitter.emit('healed', { energy });
  };
  const onAffected = ({ spellcaster }) => {
    if (spellcaster.uid === me.value.uid) return;
    me.value.buffs.push(1);
    emitter.emit('affected', { spellcaster });
  };

  room.on('joined', onRoomJoined);
  room.on('left', onRoomLeft);

  GamesAPI.on('created', onLoaded);
  GamesAPI.on('found', onLoaded);
  GamesAPI.on('assigned', onAssigned);
  GamesAPI.on('refreshed', onRefreshed);
  GamesAPI.on('rotated', onRotated);
  GamesAPI.on('attacked', onAttacked);
  GamesAPI.on('healed', onHealed);
  GamesAPI.on('affected', onAffected);
  GamesAPI.on('error', console.warn);

  return {
    current,
    status,
    action,
    exchange,
    cast,
    cards,
    map,
    me,
    isReady,
    isDiceStop,
    on,
    onDiceStop,
  };
};
