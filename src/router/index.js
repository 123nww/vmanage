import Vue from 'vue'
import VueRouter from 'vue-router'

import { getLocalStore } from "config/global.js";

Vue.use(VueRouter)

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/home/Welcome')
const Users = () => import('../views/user/Users')
const Rights = () => import('../views/power/Rights')
const Roles = () => import('../views/power/Roles')
const GoodsCategory = () => import('../views/goods/GoodsCategory')
const GoodsParams = () => import('../views/goods/GoodsParams')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    //name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    },
    //redirect:'/welcome',
    children: [
      {
        path: '', redirect: 'welcome'
      },
      {
        path: 'welcome',
        name: Welcome,
        component: Welcome
      },
      {
        path: '/users',
        name: Users,
        component: Users
      },
      {
        path: '/rights',
        name: Rights,
        component: Rights
      },
      {
        path: '/roles',
        name: Roles,
        component: Roles
      } ,
      {
        path: '/categories',
        name: GoodsCategory,
        component: GoodsCategory
      } ,
      {
        path: '/params',
        name: GoodsParams,
        component: GoodsParams
      } 
    ]
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
