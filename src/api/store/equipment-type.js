import request from '../index'

export const addeType = (params) => {
  return request.fetchPost('etype/add', params)
}

export const deleType = (params) => {
  return request.fetchPost('etype/delete', params)
}

export const uppeType = (params) => {
  return request.fetchPost('etype/update', params)
}

export const eTypeList = (params) => {
  return request.fetchGet('etype/select', params)
}
