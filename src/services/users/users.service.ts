import { Service } from '@feathersjs/feathers';

import { Application } from '../../declarations';
import { makeUsersModel } from '../../models/users.model';
import { Users } from './users.class';
import hooks from './users.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'users': Users & Service<any>;
  }
}

export default function(app: Application) {
  const Model = makeUsersModel(app);
  const paginate = app.get('paginate');
  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/users', new Users(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users');

  service.hooks(hooks);
}
