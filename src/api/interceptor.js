import axios from 'axios'
import qs from 'qs'
import { Message, Modal } from '@arco-design/web-vue'
import useUserStore from '@/store/user/index'

// if (import.meta.env.VITE_API_BASE_URL) {
//   axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
// }

const source = axios.CancelToken.source()
axios.defaults.cancelToken = source.token

// axios默认数组处理带有中括号，使用该方式重新处理
axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { indices: false })
}

// add response interceptors
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response && response.status === 401) {
      source.cancel('会话过期，取消所有请求')
      // to re-login
      Modal.error({
        title: '会话过期',
        content: '会话超时，需要重新登录',
        okText: '重新登录',
        async onOk() {
          const userStore = useUserStore()

          await userStore.logout()
          window.location.reload()
        }
      })
      return Promise.reject(error)
    }
    const finalError = response ? response.data : error
    Message.error({
      content: finalError.message,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
