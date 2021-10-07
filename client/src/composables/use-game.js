import { ref, reactive, computed } from 'vue';

import { Emitter } from '../models/emitter.class';

const useGameStatus = ({ auth, current }) => {
  const Status = {
    Pray: 'pray',
    Collect: 'collect',
    Exchange: 'exchange',
    Cast: 'cast',
    Confirm: 'confirm',
  };
  const status = computed(() => current.value.status);
  const isPray = computed(() => status.value === Status.Pray);
  const isCollect = computed(() => status.value === Status.Collect);
  const isCollected = computed(
    () => current.value.collected.includes(auth.uid),
  );
  const isExchange = computed(() => status.value === Status.Exchange);
  const isCast = computed(() => status.value === Status.Cast);
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
  };
  const action = computed(() => current.value.action || {});
  const isMine = computed(() => action.value.uid === auth.uid);
  const isPray = computed(() => action.value.step === Steps.Pray);
  const isExchange = computed(() => action.value.step === Steps.Exchange);
  const isCast = computed(() => action.value.step === Steps.Cast);
  const isPrayable = computed(
    () => isMine.value && isPray.value && !status.isPray,
  );
  const isExchangeable = computed(
    () => isMine.value && isExchange.value && !status.isExchange,
  );
  const isCastable = computed(
    () => isMine.value && isCast.value && !status.isCast,
  );
  const isPassable = computed(
    () => isMine.value && !isPray.value
  );
  const isPassing = ref(false);
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onPray = () => update({ pray: true });
  const onCollect = () => update({ collect: true });
  const onExchange = () => update({ exchange: true });
  const onAccept = () => update({ accept: true });
  const onCast = () => update({ cast: true });
  const onCasting = () => update({ casting: true });
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

  return {
    isMine,
    isPrayable,
    isExchangeable,
    isCastable,
    isPassable,
    isPassing,
    onPray,
    onCollect,
    onExchange,
    onAccept,
    onCast,
    onCasting,
    onPass,
    onTryPass,
    onConfirm,
    onCancel,
    onRemove,
  };
};

export const useGame = ({ client, auth, room, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const { GamesAPI } = client;
  const current = ref(null);
  const me = ref({});
  const status = reactive(useGameStatus({ auth, current }));
  const action = reactive(useGameAction({ client, auth, current, status, me }));
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
    console.log(game);
  };
  const onAssigned = ({ player }) => {
    logger.info('game:assigned', player.team);
    Object.assign(me.value, player);
  };
  const onRefreshed = ({ game }) => {
    logger.info('game:refreshed', game.status, game.action?.step);
    current.value = game;
    console.log(game);
  };
  const onRotated = ({ game }) => {
    logger.info('game:rotated', game.action.uid);
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
    me,
    isReady,
    on,
  };
};
