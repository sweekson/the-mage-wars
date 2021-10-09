import { ref, reactive, computed, watch } from 'vue';

import { Emitter } from '../models/emitter.class';
import { resolveElemIconProps } from '@composables/use-game-elems';

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
    () => isMine.value && !isPray.value
  );
  const isPassing = ref(false);
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onPray = () => update({ pray: true });
  const onCollect = () => update({ collect: true });
  const onCast = () => update({ cast: true });
  const onCasting = () => update({ casting: true });
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
  const onCancel = () => update({ cancel: true });
  const onRemove = () => GamesAPI.remove(current.value.id);
  const onLeave = () => {
    // A game will be deleted automatically when the last player left
    // So leaving from a deleted game will return 400 error
    update({ leave: true }).catch(e => e.code !== 400 && console.warn(e));
  };

  return {
    isMine,
    isPrayable,
    isExchangeable,
    isCastable,
    isMoveable,
    isPassable,
    isPassing,
    onPray,
    onCollect,
    onCast,
    onCasting,
    onMove,
    onPass,
    onTryPass,
    onConfirm,
    onCancel,
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
    requester.elems = resolveElemIconProps(requester.elems);
    return requester;
  });
  const responses = computed(() => {
    if (!current.value || !current.value.exchange) return [];
    const { responses } = current.value.exchange;
    if (!responses) return [];
    responses.forEach(x => (x.elems = resolveElemIconProps(x.elems)));
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
  const onClose = () => isOpen.value = false;
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

  watch(status.isExchange, x => (isOpen.value = x));
  watch(responses, () => {
    if (responses.value.find(x => x.uid === selected.value)) return;
    selected.value = null;
  });

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

export const useGame = ({ client, auth, room, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const { GamesAPI } = client;
  const current = ref(null);
  const me = ref({});
  const status = useGameStatus({ auth, current });
  const action = reactive(useGameAction({ client, auth, current, status, me }));
  const exchange = useGameElemsExchange({ client, current, status, me });
  const isReady = ref(false);
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
    Object.assign(me.value, player, {
      elems: resolveElemIconProps(player.elems),
    });
    console.log('me', me.value);
  };
  const onRefreshed = ({ game }) => {
    logger.info('game:refreshed', game.status, game.action?.step);
    current.value = game;
    console.log('game', current.value);
  };
  const onRotated = ({ game }) => {
    logger.info('game:rotated', game.action.uid);
    emitter.emit('rotated');
  };

  room.on('joined', onRoomJoined);
  room.on('left', onRoomLeft);

  GamesAPI.on('created', onLoaded);
  GamesAPI.on('found', onLoaded);
  GamesAPI.on('assigned', onAssigned);
  GamesAPI.on('refreshed', onRefreshed);
  GamesAPI.on('rotated', onRotated);
  GamesAPI.on('error', console.warn);

  return {
    current,
    status,
    action,
    exchange,
    me,
    isReady,
    on,
  };
};
