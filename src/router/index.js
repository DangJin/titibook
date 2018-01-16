import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/login'
import Index from '@/views/index'
import Home from '@/views/home'
import FileList from '@/views/FileList'
import Table from '@/views/table'
import store from '../store'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home
        }, {
          path: 'filelist',
          name: 'FileList',
          component: FileList
        }, {
          path: 'table',
          name: 'Table',
          component: Table
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 排除进入login 检查token
  if (to.path !== '/login') {
    let token = store.getters.access_token
    if (!token) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
