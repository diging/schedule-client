import Vue from 'vue'
import VueRouter from 'vue-router'
import SigninView from '../views/auth/SigninView.vue';
import createAccountView from '../views/auth/createAccountView.vue';
import adminHome from '../views/auth/adminHomeView.vue';
import HomeView from '../views/auth/HomeView.vue';
import leaveRequests from '../views/auth/leaveRequestsView.vue';
import employees from '../views/auth/employeesView.vue';

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
    path: '/createaccount',
    name: 'createAccount',
    component: createAccountView,
  },
  {
    path: '/adminHome',
    name: 'adminHome',
    component: adminHome,
  },
  {
    path: '/leaveRequests',
    name: 'leaveRequests',
    component: leaveRequests,
  },
  {
    path: '/employees',
    name: 'employees',
    component: employees,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
