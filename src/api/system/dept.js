import axios from 'axios'

export function getDeptDicts() {
  return axios.request({
    url: '/api/departments?datatype=dict',
    method: 'get'
  })
}

