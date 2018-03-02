import request from '../index'

export const addCard = (params) => {
  return request.fetchPost('memcard/add', params)
}

export const delCard = (params) => {
  return request.fetchPost('memcard/delete', params)
}

export const uppCard = (params) => {
  return request.fetchPost('memcard/update', params)
}

export const cardList = (params) => {
  return request.fetchGet('memcard/select', params)
}
