import api from './api'

/**
 * applicationService — CRUD operations for MSME loan applications.
 *
 * All methods are async and call the FastAPI backend.
 * During scaffold phase, the backend returns mock data.
 */
const applicationService = {
  /** List all applications (banker view) */
  list: () => api.get('/applications'),

  /** Get single application by ID */
  get: (id) => api.get(`/applications/${id}`),

  /** Create a new application (MSME submission) */
  create: (payload) => api.post('/applications', payload),

  /** Update an application */
  update: (id, payload) => api.put(`/applications/${id}`, payload),

  /** Add underwriter notes */
  addNotes: (id, notes) => api.post(`/applications/${id}/notes`, { notes }),

  /** Upload a document for an application */
  uploadDocument: (id, file, docType) => {
    const form = new FormData()
    form.append('file', file)
    form.append('doc_type', docType)
    return api.post(`/documents/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default applicationService
