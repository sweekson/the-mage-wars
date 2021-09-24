import { ref, watch } from 'vue';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

export const useKeepAlive = ({ socket }) => {
  const timeout = ref(30000);
  const focused = ref(true);
  const enabled = ref(false);
  const enable = () => (enabled.value = true);
  const disable = () => (enabled.value = false);
  const ping = () => {
    setTimeout(() => {
      socket.send('ping');
      focused.value && enabled.value && ping();
    }, timeout.value);
  };

  watch([focused, enabled], ([x1, x2]) => x1 && x2 && ping());

  window.addEventListener('focus', () => (focused.value = true));
  window.addEventListener('blur', () => (focused.value = false));

  return {
    enable,
    disable,
  };
};

export const useFeathers = ({ host }) => {
  const socket = io(host, {
    transports: ['websocket'],
    forceNew: true
  });
  const client = feathers();
  const keep = useKeepAlive({ socket });

  keep.enable();

  client.configure(socketio(socket));
  client.configure(authentication());

  const UsersAPI = client.service('/users');
  const RoomsAPI = client.service('/rooms');
  const PlayersAPI = client.service('/players');
  const GamesAPI = client.service('/games');

  Object.assign(client, {
    UsersAPI,
    RoomsAPI,
    PlayersAPI,
    GamesAPI,
  });

  return {
    client,
  };
};
