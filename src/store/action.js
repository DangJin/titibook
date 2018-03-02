import { login } from '../api/login/index'
import { getCsrf, refresh } from '../api/common'
import { Base64 } from 'js-base64'

export default {
  login ({commit}, data) {
    let account = data.account
    let pass = Base64.decode(data.pass)
    return new Promise((resolve, reject) => {
      login({account: account, password: pass}).then(function (res) {
        if (res.data.value) {
          let data = res.data.data
          // 设置本地存储
          sessionStorage.setItem('access_token', data.access_token)
          sessionStorage.setItem('refresh_token', data.refresh_token)
          resolve({status: true, msg: res.data.data.message})
        } else {
          resolve({status: false, msg: res.data.data.message})
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  },
  /**
   * 获取表单令牌
   * @param commit
   * @returns {Promise<any>}
   */
  getCsrf ({commit}) {
    return new Promise((resolve, reject) => {
      getCsrf().then(response => {
        if (response.value) {
          commit('UPP_CSRF', response.data.csrf)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * 刷新access_token
   * @returns {Promise<any>}
   */
  refresh () {
    return new Promise((resolve, reject) => {
      refresh().then(response => {
        if (response.value) {
          resolve({data: response.data.access_token})
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
