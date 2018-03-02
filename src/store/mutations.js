import {
  UPP_ROUTE,
  UPP_CSRF
} from './mutation-types'

export default {
  // 添加路由
  [UPP_ROUTE] (state, route) {
    state.routerList = route
  },
  // 更新表单令牌
  [UPP_CSRF] (state, csrf) {
    state.csrf = csrf
  }
}
