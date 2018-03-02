import request from '../index'

export const addPrules = (params) => {
  return request.fetchPost('prules/add', params)
}

export const delPrules = (params) => {
  return request.fetchPost('prules/delete', params)
}

export const uppPrules = (params) => {
  return request.fetchPost('prules/update', params)
}

export const prulesList = (params) => {
  return request.fetchGet('prules/select', params)
}
