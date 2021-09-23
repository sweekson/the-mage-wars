import { HookContext } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';

import { transmit, error } from '../../utils/hooks';

const { authenticate } = authentication.hooks;

const create = async ({ app, data, params }: HookContext) => {
  const rooms = app.service('rooms');
  const room = await rooms.get(data.room);

  Object.assign(params, { detail: { room } });
};

const starting = async ({ app, result }: HookContext) => {
  const { wait } = app.get('game');
  const rooms = app.service('rooms');
  const games = app.service('games');
  const { game } = result.detail;
  const params = { query: { starting: true } };

  await rooms.update(game.room, {}, params);

  setTimeout(() => {
    games.update(game.id, {}, { query: { rotate: true } });
  }, wait.start + 100);
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [create],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [transmit],
    get: [],
    create: [starting, transmit],
    update: [transmit],
    patch: [],
    remove: [transmit],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  }
};