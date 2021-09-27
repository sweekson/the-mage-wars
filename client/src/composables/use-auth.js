import { ref } from 'vue';

import { toValueMap } from './utils';
import { Emitter } from '../models/emitter.class';

export const useAuth = ({ client, logger }) => {
  const emitter = new Emitter();
  const on = emitter.on.bind(emitter);
  const { UsersAPI } = client;
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
        await client.reAuthenticate();
      } else {
        await client.authenticate({
          strategy: 'local',
          ...credentials,
        });
      }
    } catch (error) {
      if (error.code === 401) return emitter.emit('unauthenticated');
      console.error(error);
    }
  };
  const onSignup = () => signup(toValueMap({ email, name, password }));
  const onLogin = () => login(toValueMap({ email, password }));
  const onLogout = () => client.logout();
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

  client.on('login', onLoggedIn);
  client.on('logout', onLoggedOut);

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
