import axios from 'axios'

export function publish(data) {
  return axios.request({
    url: '/api/messages/publishes',
    method: 'post',
    data
  })
}

export function send(data) {
  return axios.request({
    url: '/api/messages/sends',
    method: 'post',
    data
  })
}

export function read(params) {
  return axios.request({
    url: '/api/messages/reads',
    method: 'put',
    params
  })
}

export function readAll() {
  return axios.request({
    url: '/api/messages/reads-all',
    method: 'put'
  })
}

export function getUnreadCount() {
  return axios.request({
    url: '/api/messages/unread-counts',
    method: 'get'
  })
}

export function findSelfByPage(params) {
  return axios.request({
    url: '/api/messages?datatype=small',
    method: 'get',
    params
  })
}
