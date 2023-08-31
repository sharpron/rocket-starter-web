import axios from 'axios'

export function getRoleDicts() {
  return axios.request({
    url: '/api/roles?type=dict',
    method: 'get'
  })
}
