import {
  UPP_ROUTE
} from './mutation-types'

export default {
  // 添加路由
  [UPP_ROUTE] (state, route) {
    state.routerList = route
  }
}
