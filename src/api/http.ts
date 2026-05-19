import axios from 'axios'

import { apiConfig } from '@/api/config'

const baseURL = apiConfig.baseUrl

export const http = axios.create({
  baseURL,
  timeout: 0,
})

export const fileHttp = axios.create({
  baseURL,
  timeout: 0,
  responseType: 'blob',
})

export function isNotFoundLike(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    [404, 405].includes(error.response?.status ?? 0)
  )
}

export function getApiBaseUrl() {
  return baseURL
}
