import {
  UPP_ROUTE,
  SET_TOKEN,
  UPP_TOKEN
} from './mutation-types'

export default {
  // 添加路由
  [UPP_ROUTE] (state, route) {
    state.routerList = route
  },
  [SET_TOKEN] (state, token) {
    state.token = token
  },
  [UPP_TOKEN] (state, accessToken) {
    state.token.access_token = accessToken
  }
}
