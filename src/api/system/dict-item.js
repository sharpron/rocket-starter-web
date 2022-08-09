import axios from 'axios'

export function getDictItemsAsDict() {
  return axios.request({
    url: '/api/dictionary-items?datatype=dict',
    method: 'get'
  })
}

