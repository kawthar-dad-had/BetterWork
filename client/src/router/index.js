import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

// Auth Employee
import Signin from '../components/Auth/Signin.vue'
import DemandAccount from '../components/Auth/DemandAccount.vue'
import Profile from '../components/Auth/Profile.vue'

//Dashboard 
import Employees from '../components/Dashboard/Employees/Employees'
import AddEmployee from '../components/Dashboard/Employees/AddEmployee'
import AddCompensation from '../components/Dashboard/Services/AddCompensation'
import AddDonation from '../components/Dashboard/Services/AddDonation'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard/employees',
    name: 'Employees',
    component: Employees
  },
  {
    path: '/dashboard/employees/add',
    name: 'AddEmployee',
    component: AddEmployee
  },
  {
    path: '/dashboard/services/compensations/add',
    name: 'AddCompensation',
    component: AddCompensation
  },
  {
    path: '/dashboard/services/donations/add',
    name: 'AddDonation',
    component: AddDonation
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/demand_account',
    name: 'DemandAccount',
    component: DemandAccount
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
