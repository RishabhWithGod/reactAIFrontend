import axios from 'axios'

const baseURL = (
  import.meta.env.VITE_API_BASE_URL ??
  'https://electricai-production-5b6a.up.railway.app'
).replace(/\/$/, '')

export const http = axios.create({
  baseURL,
  
})

export const fileHttp = axios.create({
  baseURL,
 
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