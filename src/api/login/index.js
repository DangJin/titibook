import axios from 'axios'
import qs from 'qs'

import { root } from '../index'

export const login = (params) => {
  return axios.post(root + 'admin/login', qs.stringify(params))
}
