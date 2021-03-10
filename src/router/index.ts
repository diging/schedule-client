import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/auth/LoginView.vue';
import SignUpView from '../views/auth/SignUpView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
