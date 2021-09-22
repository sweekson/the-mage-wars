import { Application } from '../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

import users from './users/users.service';
import rooms from './rooms/rooms.service';
import games from './games/games.service';
import players from './players/players.service';
import { Messages } from './messages.class';

export default function (app: Application): void {
  app.configure(users);
  app.configure(rooms);
  app.configure(games);
  app.configure(players);
}
