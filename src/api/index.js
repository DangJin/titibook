import axios from 'axios'
import qs from 'qs'
import store from '../store'

axios.interceptors.request.use(
  config => {
    config.baseURL = '/api/'
    config.withCredentials = true
    config.timeout = 2500
    let token = sessionStorage.getItem('access_token')
    let csrf = store.getters.csrf
    if (token) {
      config.headers = {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    if (config.url === 'refresh') {
      config.headers = {
        'refresh-token': sessionStorage.getItem('refresh_token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    if (config.url === 'imgs/add') {
      config.headers = {
        'access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    }
    if (config.url.search(/add/) !== -1 && store) {
      config.headers = {
        'access-token': token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'csrf': csrf
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    // 定时刷新access-token
    if (!response.data.value && response.data.data.message === 'token invalid') {
      // 刷新token
      store.dispatch('refresh').then(response => {
        sessionStorage.setItem('access_token', response.data)
      }).catch(error => {
        throw new Error('token刷新' + error)
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default {
  fetchGet (url, params) {
    return new Promise((resolve, reject) => {
      axios.get(url, {params: params})
        .then(
          data => {
            resolve(data.data)
          }
        ).catch(
        error => {
          reject(error)
        }
      )
    })
  },
  fetchPost (url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(params)).then(
        data => {
          resolve(data)
        }
      ).catch(
        error => {
          console.log(error)
          reject(error)
        }
      )
    })
  }
}
