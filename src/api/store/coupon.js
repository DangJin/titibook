import request from '../index'

export const addCoup = (params) => {
  return request.fetchPost('coupon/add', params)
}

export const delCoup = (params) => {
  return request.fetchPost('coupon/delete', params)
}

export const uppCoup = (params) => {
  return request.fetchPost('coupon/update', params)
}

export const coupList = (params) => {
  return request.fetchGet('coupon/select', params)
}
