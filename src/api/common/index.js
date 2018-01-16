import axios from 'axios'
import qs from 'qs'

import { root } from '../index'

export const refreshToke = (params) => {
  return axios.get(root + 'admin/login', qs.stringify(params))
}
