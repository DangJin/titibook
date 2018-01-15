import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/index'
import Home from '@/views/home'
import FileList from '@/views/FileList'
import Table from '@/views/table'

Vue.use(Router)

export default new Router({
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
