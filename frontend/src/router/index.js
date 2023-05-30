import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import StartLobby from '../views/StartLobby.vue';
import GameBaseView from '../views/GameBaseView.vue';
import JoinGame from '@/views/JoinGame';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/lobby',
    name: 'startlobby',
    component: StartLobby,
  },
  {
    path: '/game/:gameId',
    name: 'game',
    component: GameBaseView,
  },
  {
    path: '/joinGame',
    name: 'joingame',
    component: JoinGame,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
