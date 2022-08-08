import axios from 'axios'

export default function useCrudApi(uri) {
  const find = (pageable, query) => {
    return axios.request({
      url: uri,
      method: 'get',
      params: {
        ...pageable,
        ...query
      }
    })
  }
  const exportData = (pageable, query) => {
    return axios.request({
      url: uri + '/excels',
      method: 'get',
      responseType: 'blob',
      params: {
        ...pageable,
        ...query
      }
    })
  }

  const create = (data) => {
    return axios.request({
      url: uri,
      method: 'post',
      data
    })
  }

  const update = (data) => {
    return axios.request({
      url: uri,
      method: 'put',
      data
    })
  }

  const deleteByIds = (ids) => {
    return axios.request({
      url: uri,
      method: 'delete',
      params: { ids: ids.join(',') }
    })
  }

  return {
    find,
    exportData,
    create,
    update,
    deleteByIds
  }
}
