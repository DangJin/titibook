import request from '../index'

export const addStolevel = (params) => {
  return request.fetchPost('stolevel/add', params)
}

export const delStolevel = (params) => {
  return request.fetchPost('stolevel/delete', params)
}

export const uppStolevel = (params) => {
  return request.fetchPost('stolevel/update', params)
}

export const stolevelList = (params) => {
  return request.fetchGet('stolevel/select', params)
}
