import Vue from 'vue'
import VueRouter from 'vue-router'
import SigninView from '../views/auth/SigninView.vue'
import createAccountView from '../views/auth/createAccountView.vue'
import adminHome from '../views/auth/adminHomeView.vue'
import userHome from '../views/auth/userHomeView.vue'
import leaveRequests from '../views/auth/leaveRequestsView.vue'
import employees from '../views/auth/employeesView.vue'
import workerRequests from '../views/auth/workerRequestsView.vue'
import userAvailability from '../views/auth/userAvailabilityView.vue'
import AvailabilityAdminView from '../views/auth/AvailabilityAdminView.vue'
import ScheduleAdminView from '../views/auth/ScheduleAdminView.vue'
import Users from '../components/admin/UsersView.vue'

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
    path: '/leaveRequests',
    name: 'leaveRequests',
    component: leaveRequests,
  },
  {
    path: '/employees',
    name: 'employees',
    component: employees,
  },
  {
    path: '/workerRequests',
    name: 'workerRequests',
    component: workerRequests,
  },
  {
    path: '/user/availability',
    name: 'userAvailability',
    component: userAvailability,
  },
  {
    path: '/admin/availability',
    name: 'AvailabilityAdmin',
    component: AvailabilityAdminView,
  },
  {
    path: '/admin/schedule',
    name: 'ScheduleAdmin',
    component: ScheduleAdminView,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
