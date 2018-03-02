import request from '../index'

export const getCsrf = () => {
  return request.fetchGet('getcsrf')
}

export const refresh = () => {
  return request.fetchGet('refresh')
}

export const uploadFile = (params) => {
  return request.fetchPost('imgs/add', params)
}
