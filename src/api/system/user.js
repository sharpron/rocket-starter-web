import axios from 'axios'

export function modifyPass(data) {
  return axios.request({
    url: '/api/users/passwords',
    method: 'put',
    data
  })
}

export function modifySelfInfo(data) {
  return axios.request({
    url: '/api/users/me',
    method: 'put',
    data
  })
}

export function modifySelfPass(data) {
  return axios.request({
    url: '/api/users/me/passwords',
    method: 'put',
    data
  })
}
