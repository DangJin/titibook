import request from '../index'

export const adminList = (params) => {
  return request.fetchGet('admin/select', params)
}
export const addAdmin = (params) => {
  return request.fetchPost('admin/add', params)
}
export const delAdmin = (params) => {
  return request.fetchPost('admin/delete', params)
}
export const uppAdmin = (params) => {
  return request.fetchPost('admin/update', params)
}
export const getperRoles = (params) => {
  return request.fetchGet('role/select', params)
}

export const getPerAdminRole = (params) => {
  return request.fetchGet('admin/getrole', params)
}
export const uppRole2Admin = (params) => {
  return request.fetchPost('admin/addrole', params)
}
