import { Params } from '@feathersjs/feathers';
import { Service, NedbServiceOptions } from 'feathers-nedb';

import { Application } from '../../declarations';

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
}

export class Users extends Service<User> {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
  }

  create(data: User, params?: Params) {
    const { email, name, password } = data;
    // Call the original `create` method with existing `params` and new data
    return super.create({ email, name, password }, params);
  }
}
