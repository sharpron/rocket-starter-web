import axios from 'axios'

export function modifyPass(data) {
    return axios.request({
        url: '/api/users/passwords',
        method: 'put',
        data
    })
}