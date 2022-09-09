import axios from 'axios'

export function getSelfMenus() {
  return axios.request({
    url: '/api/menus/me',
    method: 'get'
  })
}

export function getMenuDicts() {
  return axios.request({
    url: '/api/menus?datatype=dict',
    method: 'get'
  })
}
