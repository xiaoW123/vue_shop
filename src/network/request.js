import Axios from 'axios'

export function request(config) {
  const instance = Axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  })
  return instance(config)
}