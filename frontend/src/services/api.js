import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.')
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
})

export const createVisitor = (data) => api.post('/visitors', data)
export const getVisitor = (id) => api.get(`/visitors/${id}`)

export const uploadSelfie = (visitorId, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/visitors/${visitorId}/selfie`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const generateAvatar = (visitorId) => api.post(`/visitors/${visitorId}/avatar`)
export const calculateAstrology = (visitorId) => api.post(`/visitors/${visitorId}/astrology`)
export const revealAura = (visitorId) => api.post(`/visitors/${visitorId}/aura`)
export const revealSpiritAnimal = (visitorId) => api.post(`/visitors/${visitorId}/spirit-animal`)
export const revealArchetype = (visitorId) => api.post(`/visitors/${visitorId}/archetype`)
export const getWheelSegments = () => api.get('/visitors/wheel/segments')
export const spinWheel = (visitorId) => api.post(`/visitors/${visitorId}/wheel/spin`)
export const revealDestinyVault = (visitorId) => api.post(`/visitors/${visitorId}/destiny-vault`)
export const getGeminiInsight = (visitorId) => api.post(`/visitors/${visitorId}/gemini-insight`)
export const generatePassport = (visitorId) => api.post(`/visitors/${visitorId}/passport`)
export const generateQR = (visitorId) => api.post(`/visitors/${visitorId}/qr`)
export const sendEmail = (visitorId) => api.post(`/visitors/${visitorId}/send-email`)

export default api
