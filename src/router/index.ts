import Vue from 'vue'
import VueRouter from 'vue-router'
import SigninView from '../views/auth/SigninView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/signin',
    name: 'Signin',
    component: SigninView,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
