import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

export const useFeathers = ({ host }) => {
  const socket = io(host, {
    transports: ['websocket'],
    forceNew: true
  });
  const client = feathers();

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
