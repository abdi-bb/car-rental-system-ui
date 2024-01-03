import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import NotFound from '../views/NotFound.vue'

import UserRegistrationForm from '../components/auth/UserRegistrationForm.vue';
import LoginForm from '../components/auth/LoginForm.vue';

import CarsList from '../components/cars/CarsList.vue';
import CarDetail from '../components/cars/CarDetail.vue';
import CarReviewsList from '../components/cars/CarReviewsList.vue';
import CarReviewDetail from '../components/cars/CarReviewDetail.vue';
import UsersList from '../components/users/UsersList.vue';
import UserDetail from '../components/users/UserDetail.vue';
import BookingsList from '../components/bookings/BookingsList.vue';
import BookingDetail from '../components/bookings/BookingDetail.vue';

const routes = [
  {
    path: '/register',
    name: 'UserRegistrationForm',
    component: UserRegistrationForm,
  },
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm,
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  },
  {
    path: '/cars',
    name: 'CarsList',
    component: CarsList
  },
  {
    path: '/car/:id',
    name: 'CarDetail',
    component: CarDetail,
    props: true
  },
  {
    path: '/car/:carId/reviews',
    name: 'CarReviewsList',
    component: CarReviewsList,
  },
  {
    path: '/car/:carId/review/:reviewId',
    name: 'CarReviewDetail',
    component: CarReviewDetail,
  },
  {
    path: '/users',
    name: 'UsersList',
    component: UsersList
  },
  {
    path: '/customer/:id',
    name: 'UserDetail',
    component: UserDetail,
  },
  {
    path: '/bookings',
    name: 'BookingsList',
    component: BookingsList
  },
  {
    path: '/booking/:id',
    name: 'BookingDetail',
    component: BookingDetail,
  },
    // redirect
  {
    path: '/car-list',
    redirect: '/cars'
  },
  // 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
