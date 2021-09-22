import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './views/home.vue';
import Signup from './views/signup.vue';
import Login from './views/login.vue';
import Lobby from './views/lobby.vue';
import MyRoom from './views/my-room.vue';
import MyGame from './views/my-game.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/signup', component: Signup },
    { path: '/login', component: Login },
    { path: '/lobby', component: Lobby },
    { path: '/room', component: MyRoom },
    { path: '/game', component: MyGame },
  ],
});
