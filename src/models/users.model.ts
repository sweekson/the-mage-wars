import NeDB from 'nedb';
import path from 'path';

import { Application } from '../declarations';

export function makeUsersModel(app: Application) {
  const nedb = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(nedb, 'users.db'),
    autoload: true,
  });

  Model.ensureIndex({ fieldName: 'email', unique: true });

  return Model;
}
