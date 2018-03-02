import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/login'
import Index from '@/views/index'
import Home from '@/views/home'
import FileList from '@/views/FileList'
import Table from '@/views/table'
import Role from '@/views/auth/role'
import Admin from '@/views/auth/admin'
import Store from '@/views/store/store'
import addStore from '@/views/store/add'
import editStore from '@/views/store/edit'
import stoConfig from '@/views/store/config'
import eqp from '@/views/equipment/equipment'
import addEqp from '@/views/equipment/add'
import editEqp from '@/views/equipment/edit'
import coupon from '@/views/coupon/coupon'
import card from '@/views/card/index'
import cardConfig from '@/views/card/cardConfig'
import prules from '@/views/prules/index'
import config from '@/views/config/index'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: to => {
        return 'Login'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/index',
      name: '首页',
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
        }, {
          path: 'role',
          name: '权限',
          component: Role
        }, {
          path: 'admin',
          name: '管理员',
          component: Admin
        }, {
          path: 'store',
          name: '门店管理',
          component: Store
        }, {
          path: 'addStore',
          name: '添加门店',
          component: addStore
        }, {
          path: 'editStore',
          name: '修改门店',
          component: editStore
        }, {
          path: 'sto-config',
          name: '门店基础配置',
          component: stoConfig
        }, {
          path: 'eqp',
          name: '设备类型',
          component: eqp
        }, {
          path: 'addEqo',
          name: '添加设备类型',
          component: addEqp
        }, {
          path: 'editEqp',
          name: '修改设备类型',
          component: editEqp
        }, {
          path: 'coup',
          name: '优惠券管理',
          component: coupon
        }, {
          path: 'card',
          name: '会员卡管理',
          component: card
        }, {
          path: 'card-config',
          name: '会员卡管理',
          component: cardConfig
        }, {
          path: 'prules',
          name: '积分规则',
          component: prules
        }, {
          path: 'config',
          name: '平台管理',
          component: config
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 排除进入login 检查token
  if (to.path !== '/login') {
    let token = sessionStorage.getItem('access_token')
    if (!token) {
      next({
        path: '/login',
        redirect: {path: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
