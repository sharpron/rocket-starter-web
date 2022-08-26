import axios from 'axios'

export function clearByStatus(params) {
    return axios.request({
        url: '/api/logs',
        method: 'delete',
        params
    })
}

