const socket = io('localhost:3030');
const app = feathers();
const { provide, inject, ref, reactive, computed } = Vue;

const toValueMap = (values) => {
  const reducer = (map, key) => {
    return Object.assign(map, { [key]: values[key].value });
  };
  return Object.keys(values).reduce(reducer, {});
};

app.configure(feathers.socketio(socket));
app.configure(feathers.authentication());

app.io.on('disconnect', console.log);

const UsersAPI = app.service('/users');
const RoomsAPI = app.service('/rooms');
const GamesAPI = app.service('/games');

class Emitter extends EventTarget {
  on(type, listener) {
    this.addEventListener(type, listener);
  }

  emit(type, detail) {
    const event = new Event(type);
    event.detail = detail;
    this.dispatchEvent(event);
  }
}

const useLogger = () => {
  const logs = ref([]);
  const time = () => new Date().toTimeString().slice(0, 8);
  const log = (level, text) => {
    logs.value.push({ level, text: text.join(' '), time: time() });
  };
  const info = (...text) => log('INFO', text);
  const warn = (...text) => log('WARN', text);
  const error = (...text) => log('ERROR', text);
  const clear = () => (logs.value = []);
  return {
    logs,
    info,
    warn,
    error,
    clear,
  };
};

const useAuth = ({ app, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const uid = ref(null);
  const current = ref(null);
  const email = ref('wilson@amnesia.net');
  const name = ref('');
  const password = ref('123456789');
  const isLoggedIn = ref(false);
  const signup = (credentials) => UsersAPI.create(credentials).then(onLogin);
  const login = async (credentials) => {
    try {
      if (!credentials) {
        await app.reAuthenticate();
      } else {
        await app.authenticate({
          strategy: 'local',
          ...credentials,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onSignup = () => signup(toValueMap({ email, name, password }));
  const onLogin = () => login(toValueMap({ email, password }));
  const onLogout = () => app.logout();
  const onLoggedIn = ({ user }) => {
    logger.info('auth:login', user._id);
    uid.value = user._id;
    current.value = user;
    isLoggedIn.value = true;
    emitter.emit('login', { uid: user._id });
  };
  const onLoggedOut = ({ user }) => {
    logger.info('auth:logout');
    uid.value = null;
    isLoggedIn.value = false;
    emitter.emit('logout', { uid: user._id });
  };

  app.on('login', onLoggedIn);
  app.on('logout', onLoggedOut);

  login();

  return {
    uid,
    current,
    email,
    name,
    password,
    isLoggedIn,
    on,
    login,
    onSignup,
    onLogin,
    onLogout,
  };
};

const useRoom = ({ auth, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const name = ref('GOGOGO');
  const current = ref(null);
  const players = computed(() => {
    const reducer = (m, x) => Object.assign(m, { [x.uid]: x });
    return current.value.players.reduce(reducer, {});
  });
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
  const onLeave = () => update(current.value.id, { leave: true });
  const onLogin = ({ detail }) => {
    RoomsAPI.find().then(onRoomsLoaded);
    RoomsAPI.find({ query: { uid: detail.uid } }).then(onMyRoomLoaded);
  };
  const onLogout = ({ detail }) => {
    current.value = null;
    rooms.value = [];
    isLoaded.value = false;
    isRoomsLoaded.value = false;
    isMyRoomLoaded.value = false;
  };
  const onRoomsLoaded = (result) => {
    logger.info('rooms:loaded', result.length);
    rooms.value = result;
    isRoomsLoaded.value = true;
    isLoaded.value = isRoomsLoaded.value && isMyRoomLoaded.value;
  };
  const onMyRoomLoaded = (result) => {
    logger.info('room:loaded', result?.id);
    result && update(result.id, { join: true });
    isMyRoomLoaded.value = true;
    isLoaded.value = isRoomsLoaded.value && isMyRoomLoaded.value;
  };
  const onCreated = (result) => {
    logger.info('room:created', result.id, result.admin.uid);
    if (result.admin.uid === auth.uid) {
      current.value = result;
      emitter.emit('joined', { id: current.value.id });
    }
    rooms.value = rooms.value.concat(result);
  };
  const onJoined = ({ room }) => {
    logger.info('room:joined', room.id);
    current.value = room;
    emitter.emit('joined', { id: current.value.id });
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
    emitter.emit('started');
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
    players,
    rooms,
    counts,
    isLoaded,
    isJoined,
    isAdmin,
    on,
    onCreate,
    onJoin,
    onLeave,
  };
};

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

const useGameAction = ({ auth, current, status }) => {
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
  const onCollect = () => update({ collect: true, uid: auth.uid });
  const onExchange = () => update({ exchange: true });
  const onAccept = () => update({ accept: true });
  const onCast = () => update({ cast: true });
  const onCasting = () => update({ casting: true });
  const onPass = () => update({ rotate: true });
  const onConfirm = () => update({ confirm: true, uid: auth.uid });
  const onCancel = () => update({ cancel: true });

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
  };
};

const useGame = ({ auth, room, logger }) => {
  const current = ref(null);
  const status = reactive(useGameStatus({ auth, current }));
  const action = reactive(useGameAction({ auth, current, status }));
  const isReady = ref(false);
  const create = () => GamesAPI.create({ room: room.current.id });
  const update = (query) => GamesAPI.update(current.value.id, {}, { query });
  const onStart = () => create();
  const onRoomJoined = ({ detail }) => {
    GamesAPI.find({ query: { room: detail.id } }).then(onLoaded);
  };
  const onRoomStarted = () => {
    isReady.value = true;
  };
  const onRoomLeft = () => {
    logger.info('game:left');
    current.value = null;
    isReady.value = false;
  };
  const onLoaded = (result) => {
    logger.info('game:loaded', result?.status, result?.action?.step);
    current.value = result;
    isReady.value = !!result;
  };
  const onCreated = (result) => {
    logger.info('game:created', result.id);
    current.value = result;
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
    onStart,
  };
};

const Signup = {
  inject: ['auth'],
  template: `
    <form @keyup.enter="auth.onLogin">
      <h2 v-t="'common.signup'"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.name" type="text" />
      <input v-model="auth.password" type="password" />
      <button v-t="'common.signup'" type="button" @click="auth.onSignup"></button>
    </form>
  `,
};

const Login = {
  inject: ['auth'],
  template: `
    <form @keyup.enter="auth.onLogin">
      <h2 v-t="'common.login'"></h2>
      <input v-model="auth.email" type="text" />
      <input v-model="auth.password" type="password" />
      <button v-t="'common.login'" type="button" @click="auth.onLogin"></button>
    </form>
  `,
};

const Navbar = {
  inject: ['auth'],
  template: `
    <nav v-else class="flexbox flex-center-y">
      <span class="flex1">{{ auth.current.name }}</span>
      <button v-t="'common.logout'" type="button" @click="auth.onLogout"></button>
    </nav>
  `,
};

const Lobby = {
  inject: ['room'],
  template: `
    <section>
      <h2>Lobby</h2>
      <form class="flexbox">
        <input v-model="room.name" type="text" class="flex1" />
        <button type="button" @click="room.onCreate">Create</button>
      </form>
      <div
        v-for="item in room.rooms"
        :key="item.id"
        class="flexbox"
      >
        <span class="flex1">{{ item.name }} ({{ item.admin.name }}) ({{ item.status }}) ({{ item.players.length }}) </span>
        <button v-if="item.isOpen" type="button" @click="room.onJoin(item.id)">Join</button>
      </div>
    </section>
  `,
};

const Players = {
  template: `
    <section>
      <div
        v-for="player in list"
        :key="player.uid"
      >
        {{ player.name }}
      </div>
    </section>
  `,
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
}

const MyRoom = {
  inject: ['room', 'game'],
  components: {
    Players,
  },
  template: `
    <section>
      <h2>{{ room.current.name }}</h2>
      <form>
        <button v-if="room.isAdmin" type="button" @click="game.onStart">Start</button>
        <button type="button" @click="room.onLeave">Leave</button>
      </form>
      <Players :list="room.current.players" />
    </section>
  `,
}

const GameActions = {
  inject: ['room', 'game'],
  template: `
    <section>
      <button
        :disabled="!game.action.isPrayable"
        class="btn-block"
        type="button"
        @click="game.action.onPray"
      >
        Pray
      </button>

      <button
        :disabled="!game.action.isExchangeable"
        class="btn-block"
        type="button"
        @click="game.action.onExchange"
      >
        Exchange
      </button>

      <button
        :disabled="!game.action.isCastable"
        class="btn-block"
        type="button"
        @click="game.action.onCast"
      >
        Cast
      </button>

      <button
        :disabled="!game.action.isPassable"
        class="btn-block"
        type="button"
        @click="game.action.onPass"
      >
        Pass
      </button>

      <button
        class="btn-block"
        type="button"
        @click="room.onLeave"
      >
        Leave
      </button>
    </section>
  `,
};

const GameMain = {
  inject: ['game'],
  template: `
    <section>
      <div v-if="game.status.isPray && !game.status.isCollected">
        <h3>Pray</h3>
        <button
          type="button"
          @click="game.action.onCollect"
        >
          Collect
        </button>
      </div>

      <div v-if="game.status.isExchange && game.action.isMine">
        <h3>Exchange</h3>
        <button
          type="button"
          @click="game.action.onAccept"
        >
          Accept
        </button>
        <button
          type="button"
          @click="game.action.onCancel"
        >
          Cancel
        </button>
      </div>

      <div v-if="game.status.isExchange && !game.action.isMine">
        <h3>Ask For Exchange</h3>
      </div>

      <div v-if="game.status.isCast && game.action.isMine">
        <h3>Cast A Spell</h3>
        <button
          type="button"
          @click="game.action.onCasting"
        >
          Cast
        </button>
        <button
          type="button"
          @click="game.action.onCancel"
        >
          Cancel
        </button>
      </div>

      <div v-if="game.status.isConfirm && !game.status.isConfirmed">
        <h3>Current Status</h3>
        <button
          type="button"
          @click="game.action.onConfirm"
        >
          Confirm
        </button>
      </div>
    </section>
  `,
};

const MyGame = {
  inject: ['room', 'game'],
  components: {
    Players,
    GameMain,
    GameActions,
  },
  template: `
    <section>
      <h2>My Game ({{ game.current.round }})</h2>
      <div class="flexbox">
        <Players :list="room.current.players" class="flex1" />
        <GameMain class="flex2" />
        <GameActions />
      </div>
    </section>
  `,
};

const Logs = {
  inject: ['logger'],
  template: `
    <section class="logs">
      <div>
        <button type="button" class="btn-block" @click="logger.clear">Clear</button>
      </div>

      <div
        v-for="(log, index) in logger.logs"
        :key="index"
      >
        {{ log.time }} {{ log.text }}
      </div>
    </section>
  `,
};

const App = {
  components: {
    Signup,
    Login,
    Navbar,
    Lobby,
    Players,
    MyRoom,
    MyGame,
    Logs,
  },
  template: `
    <Signup v-if="!auth.isLoggedIn" />
    <Login v-if="!auth.isLoggedIn" />
    <Navbar v-else />
    <main v-if="auth.isLoggedIn" class="flexbox">
      <div class="content flex1">
        <Lobby v-if="room.isLoaded && !room.isJoined" />
        <MyRoom v-if="room.isJoined && !game.isReady" />
        <MyGame v-if="game.isReady" />
      </div>
      <Logs />
    </main>
  `,
  setup() {
    const logger = reactive(useLogger());
    const auth = reactive(useAuth({ app, logger }));
    const room = reactive(useRoom({ app, auth, logger }));
    const game = reactive(useGame({ app, auth, room, logger }));

    provide('logger', logger);
    provide('app', app);
    provide('auth', auth);
    provide('room', room);
    provide('game', game);

    return {
      auth,
      room,
      game,
    };
  },
};

const i18n = VueI18n.createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      common: {
        signup: 'Sign Up',
        login: 'Log In',
        logout: 'Log Out',
      },
    },
    ja: {
      common: {
        signup: '登録',
        login: 'ログイン',
        logout: 'ログアウト',
      },
    },
  },
});

Vue.createApp(App).use(i18n).mount('#app');