import Axios from 'axios'

export function request(config) {
  const instance = Axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  })

  /* 请求拦截 */
  instance.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  return instance(config)
}