import axios from 'axios'

export function login(data) {
  return axios.request({
    url: '/api/authenticate',
    method: 'post',
    data: {
      ...data
    }
  })
}

export function isAuthenticated() {
  return axios.request({
    url: '/api/is-authenticated',
    method: 'get'
  })
}

export function getUserInfo() {
  return axios.request({
    url: '/api/authenticated',
    method: 'get'
  })
}

export function getCaptcha() {
  return axios.request({
    url: '/api/captcha',
    method: 'get'
  })
}

export function logout() {
  return axios.request({
    url: '/api/tokens',
    method: 'delete'
  })
}
