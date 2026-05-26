export type ApiMode = 'auto' | 'mock' | 'legacy' | 'pipeline'

export const apiConfig = {
  baseUrl: (
    // import.meta.env.VITE_API_BASE_URL ??
    'https://api.splitreef.com'
    // 'https://electricai-production-5b6a.up.railway.app'
  ).replace(/\/$/, ''),
  mode: ((import.meta.env.VITE_API_MODE ?? 'auto').toLowerCase() as ApiMode),
}

export function isMockApiMode() {
  return apiConfig.mode === 'mock'
}
