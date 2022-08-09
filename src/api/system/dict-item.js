import axios from 'axios'

export function getDictItemsAsDict(params) {
  return axios.request({
    url: '/api/dictionary-items?datatype=dict',
    method: 'get',
    params
  })
}

