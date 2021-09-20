import { HookContext } from '@feathersjs/feathers';

import { transmit } from '../../utils/hooks';

const create = async ({ app, data, params }: HookContext) => {
  const rooms = app.service('rooms');
  const room = await rooms.get(data.room);

  Object.assign(params, { detail: { room } });
};

const starting = async ({ app, result }: HookContext) => {
  const { wait } = app.get('game');
  const rooms = app.service('rooms');
  const games = app.service('games');
  const params = { query: { starting: true } };

  await rooms.update(result.room, {}, params);

  setTimeout(() => {
    games.update(result.id, {}, { query: { rotate: true } });
  }, wait.start + 100);
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [create],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [starting],
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