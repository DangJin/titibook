import request from '../index'

export const addLevcar = (params) => {
  return request.fetchPost('levcar/add', params)
}

export const delLevcar = (params) => {
  return request.fetchPost('levcar/delete', params)
}

export const uppLevcar = (params) => {
  return request.fetchPost('levcar/update', params)
}

export const levcarList = (params) => {
  return request.fetchGet('levcar/select', params)
}
