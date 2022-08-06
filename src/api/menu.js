import axios from 'axios'

export function getSelfMenus() {
  return axios.request({
    url: '/api/menus',
    method: 'get'
  })
}

export function find() {
  return axios.request({
    url: '/api/menus',
    method: 'get'
  })
}

export function create(data) {
  return axios.request({
    url: '/api/menus',
    method: 'post',
    data
  })
}

export function update(data) {
  return axios.request({
    url: '/api/menus',
    method: 'put',
    data
  })
}

export function deleteByIds(ids) {
  return axios.request({
    url: '/api/menus',
    method: 'delete',
    params: { ids }
  })
}

export default {
  find,
  create,
  update,
  deleteByIds
}
