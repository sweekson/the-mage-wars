import { ref, reactive, computed } from 'vue';

import { Emitter } from '../models/emitter.class';

const useGameStatus = ({ auth, current }) => {
  const Status = {
    Pray: 'pray',
    Exchange: 'exchange',
    Cast: 'cast',
    Confirm: 'confirm',
  };
  const status = computed(() => current.value.status);
  const isPray = computed(() => status.value === Status.Pray);
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
    isCollected,
    isExchange,
    isCast,
    isConfirm,
    isConfirmed,
  };
};

const useGameAction = ({ client, auth, current, status }) => {
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
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onPray = () => update({ pray: true });
  const onCollect = () => update({ collect: true });
  const onExchange = () => update({ exchange: true });
  const onAccept = () => update({ accept: true });
  const onCast = () => update({ cast: true });
  const onCasting = () => update({ casting: true });
  const onPass = () => update({ rotate: true });
  const onConfirm = () => update({ confirm: true });
  const onCancel = () => update({ cancel: true });
  const onRemove = () => GamesAPI.remove(current.value.id);

  return {
    isMine,
    isPrayable,
    isExchangeable,
    isCastable,
    isPassable,
    onPray,
    onCollect,
    onExchange,
    onAccept,
    onCast,
    onCasting,
    onPass,
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
  const status = reactive(useGameStatus({ auth, current }));
  const action = reactive(useGameAction({ client, auth, current, status }));
  const isReady = ref(false);
  const create = () => GamesAPI.create({ room: room.current.id });
  const onStart = () => create();
  const onRoomJoined = ({ detail }) => {
    GamesAPI.find({ query: { room: detail.id } }).then(onLoaded);
  };
  const onRoomStarted = () => {
    isReady.value = true;
  };
  const onRoomLeft = () => {
    logger.info('game:reset');
    current.value = null;
    isReady.value = false;
  };
  const onLoaded = (game) => {
    logger.info('game:loaded', game?.status, game?.action?.step);
    current.value = game;
    isReady.value = !!game;
    isReady.value && emitter.emit('ready');
    console.log(game);
  };
  const onCreated = ({ game }) => {
    logger.info('game:created', game.id);
    current.value = game;
    console.log(game);
  };
  const onRefreshed = ({ game }) => {
    logger.info('game:refreshed ', game.status, game.action?.step);
    current.value = game;
  };
  const onRotated = ({ game }) => {
    logger.info('game:rotated', game.action.uid);
  };

  room.on('joined', onRoomJoined);
  room.on('started', onRoomStarted);
  room.on('left', onRoomLeft);

  GamesAPI.on('created', onCreated);
  GamesAPI.on('refreshed', onRefreshed);
  GamesAPI.on('rotated', onRotated);
  GamesAPI.on('error', console.warn);

  return {
    current,
    status,
    action,
    isReady,
    on,
    onStart,
  };
};
