
import axios from 'axios'


export function upload(file) {
    const data = new FormData()
    data.append('file', file)
    return axios.post('/api/files', data)
}
