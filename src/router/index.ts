import Vue from 'vue'
import VueRouter from 'vue-router'
import SigninView from '../views/auth/SigninView.vue';
import adminHome from '../views/auth/adminHomeView.vue';
import HomeView from '../views/auth/HomeView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'homeView',
    component: HomeView,
  },
  {
    path: '/',
    name: 'Signin',
    component: SigninView,
  },
  {
    path: '/adminHome',
    name: 'adminHome',
    component: adminHome,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
