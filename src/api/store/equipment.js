import request from '../index'

export const addStore = (params) => {
  return request.fetchPost('store/add', params)
}

export const delEqp = (params) => {
  return request.fetchPost('equipment/delete', params)
}

export const uppStore = (params) => {
  return request.fetchPost('store/update', params)
}

export const eqpList = (params) => {
  return request.fetchGet('store/getequ', params)
}
