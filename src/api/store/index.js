import request from '../index'

export const addStore = (params) => {
  return request.fetchPost('store/add', params)
}

export const delStore = (params) => {
  return request.fetchPost('store/delete', params)
}

export const uppStore = (params) => {
  return request.fetchPost('store/update', params)
}

export const storeList = (params) => {
  return request.fetchGet('store/select', params)
}
