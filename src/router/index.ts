import Vue from 'vue'
import VueRouter from 'vue-router'
import SigninView from '../views/auth/SigninView.vue';
import createAccountView from '../views/auth/createAccountView.vue';
import adminHome from '../views/auth/adminHomeView.vue';
import userHome from '../views/auth/userHomeView.vue';
import adminLeaveRequests from '../views/auth/adminLeaveRequestsView.vue';
import employees from '../views/auth/employeesView.vue';
import userLeaveRequests from '../views/auth/userLeaveRequestsView.vue'
import userAvailability from '../views/auth/userAvailabilityView.vue'

Vue.use(VueRouter)

const routes = [
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
    path: '/userHome',
    name: 'userHome',
    component: userHome,
  },
  {
    path: '/adminLeaveRequests',
    name: 'adminLeaveRequests',
    component: adminLeaveRequests,
  },
  {
    path: '/employees',
    name: 'employees',
    component: employees,
  },
  {
    path: '/userLeaveRequests',
    name: 'userLeaveRequests',
    component: userLeaveRequests,
  },
  {
    path: '/user/availability',
    name: 'userAvailability',
    component: userAvailability,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
