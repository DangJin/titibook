import {
  UPP_ROUTE,
  GET_USERINFO,
  UPP_USERINFO
} from './mutation-types'

export default {
  // 添加路由
  [UPP_ROUTE] (state, route) {
    state.routerList = route
  },
  [GET_USERINFO] (state, user) {
    state.userInfo = user
  },
  [UPP_USERINFO] (state, user) {
  }
}
