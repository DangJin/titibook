import request from '../index'

export const roleList = (params) => {
  return request.fetchGet('role/select', params)
}
export const addRole = (params) => {
  return request.fetchPost('role/add', params)
}
export const delRole = (params) => {
  return request.fetchPost('role/delete', params)
}
export const uppRole = (params) => {
  return request.fetchPost('role/update', params)
}
export const permissionSelect = (params) => {
  return request.fetchGet('permission/select', params)
}
export const getperRole = (params) => {
  return request.fetchGet('role/getper', params)
}
export const uppPer = (params) => {
  return request.fetchPost('/role/addper', params)
}
