import Vue from 'vue'
import VueRouter from 'vue-router'

import { getLocalStore } from "config/global.js";

Vue.use(VueRouter)

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { title: '登录' } },
  { path: '/home', name: 'Home', component: Home, meta: { title: '首页' } }
]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    return next();
  }

  const token = getLocalStore('token');
  if (token) {
    next();
  } else {
    next('/login');
  }

})

export default router
