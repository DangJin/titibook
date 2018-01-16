import { login } from '../api/login/index'
import { Base64 } from 'js-base64'

export default {
  login ({commit}, data) {
    let account = data.account
    let pass = Base64.decode(data.pass)
    return new Promise((resolve, reject) => {
      login({account: account, password: pass}).then(function (res) {
        if (res.data.value) {
          let data = res.data.data
          let token = {
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }
          commit('SET_TOKEN', token)
          resolve({status: true, msg: res.data.data.message})
        } else {
          resolve({status: false, msg: res.data.data.message})
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  }
}
