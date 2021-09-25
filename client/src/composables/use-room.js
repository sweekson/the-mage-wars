import { ref, reactive, computed } from 'vue';

import { Emitter } from '../models/emitter.class';

const useRoomStatus = ({ current }) => {
  const Status = {
    Open: 'open',
    Ready: 'ready',
    Starting: 'starting',
    Started: 'started',
  };
  const status = computed(() => current.value.status);
  const isOpen = computed(() => status.value === Status.Open);
  const isReady = computed(() => status.value === Status.Ready);
  const isStarting = computed(() => status.value === Status.Starting);
  const isStarted = computed(() => status.value === Status.Started);

  return {
    isOpen,
    isReady,
    isStarting,
    isStarted,
  };
};

export const useRoom = ({ client, auth, logger }) => {
  const { RoomsAPI, PlayersAPI } = client;
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const name = ref('GOGOGO');
  const current = ref(null);
  const status = reactive(useRoomStatus({ current }));
  const players = ref([]);
  const rooms = ref([]);
  const counts = ref(0);
  const isLoaded = ref(false);
  const isRoomsLoaded = ref(false);
  const isMyRoomLoaded = ref(false);
  const isJoined = computed(() => !!current.value);
  const isAdmin = computed(() => current.value?.admin.uid === auth.uid);
  const create = () => RoomsAPI.create({ name: name.value });
  const update = (id, query) => RoomsAPI.update(id, {}, { query });
  const countdown = () => {
    setTimeout(() => {
      logger.info('room:countdown', counts.value);
      counts.value -= 1;
      counts.value > 0 && countdown();
    }, 1000);
  };
  const onCreate = () => create();
  const onJoin = (id) => update(id, { join: true });
  const onStart = () => update(current.value.id, { start: true });
  const onLeave = () => update(current.value.id, { leave: true });
  const onLogin = ({ detail }) => {
    RoomsAPI.find().then(onRoomsLoaded);
    RoomsAPI.find({ query: { uid: detail.uid } }).then(onMyRoomLoaded);
  };
  const onLogout = () => {
    current.value = null;
    rooms.value = [];
    isLoaded.value = false;
    isRoomsLoaded.value = false;
    isMyRoomLoaded.value = false;
  };
  const onRoomsLoaded = (list) => {
    logger.info('rooms:loaded', list.length);
    rooms.value = list;
    isRoomsLoaded.value = true;
    isLoaded.value = isRoomsLoaded.value && isMyRoomLoaded.value;
  };
  const onMyRoomLoaded = (room) => {
    logger.info('room:loaded', room?.id);
    room && update(room.id, { join: true });
    isMyRoomLoaded.value = true;
    isLoaded.value = isRoomsLoaded.value && isMyRoomLoaded.value;
  };
  const onPlayersLoaded = ({ list }) => {
    players.value = list;
  };
  const onCreated = (room) => {
    logger.info('room:created', room.id, room.admin.uid);
    if (room.admin.uid === auth.uid) {
      current.value = room;
      emitter.emit('joined', { id: current.value.id });
    }
    rooms.value = rooms.value.concat(room);
  };
  const onJoined = ({ room }) => {
    logger.info('room:joined', room.id);
    current.value = room;
    emitter.emit(
      'joined',
      { id: current.value.id, isStarted: status.isStarted },
    );
  };
  const onRefreshed = ({ room }) => {
    logger.info('room:refreshed', room.id);
    if (room.id === current.value?.id) {
      current.value = room;
    }
    const index = rooms.value.findIndex(x => x.id === room.id);
    rooms.value.splice(index, 1, room);
    rooms.value = rooms.value.slice(0);
  };
  const onAssigned = ({ room }) => {
    logger.info('room:assigned', room.id);
    current.value = room;
  };
  const onStarting = () => {
    logger.info('room:starting');
    counts.value = 3;
    countdown();
  };
  const onStarted = () => {
    logger.info('room:started');
    counts.value = 0;
    emitter.emit('started', { id: current.value.id });
  };
  const onLeft = () => {
    logger.info('room:left');
    current.value = null;
    emitter.emit('left');
  };
  const onDeleted = ({ id }) => {
    logger.info('room:deleted', id);
    const index = rooms.value.findIndex(x => x.id === id);
    rooms.value.splice(index, 1);
    rooms.value = rooms.value.slice(0);
  };

  auth.on('login', onLogin);
  auth.on('logout', onLogout);

  PlayersAPI.on('refreshed', onPlayersLoaded);

  RoomsAPI.on('created', onCreated);
  RoomsAPI.on('joined', onJoined);
  RoomsAPI.on('refreshed', onRefreshed);
  RoomsAPI.on('assigned', onAssigned);
  RoomsAPI.on('starting', onStarting);
  RoomsAPI.on('started', onStarted);
  RoomsAPI.on('left', onLeft);
  RoomsAPI.on('deleted', onDeleted);
  RoomsAPI.on('error', console.warn);

  return {
    name,
    current,
    status,
    players,
    rooms,
    counts,
    isLoaded,
    isJoined,
    isAdmin,
    on,
    onCreate,
    onJoin,
    onStart,
    onLeave,
  };
};
