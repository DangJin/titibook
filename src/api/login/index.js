import request from '../index'

export const login = (params) => {
  return request.fetchPost('login', params)
}
