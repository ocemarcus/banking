import { request } from '../lib/api'

export async function login({ email, password }) {
  // skipAuthRedirect: true so invalid credentials don't trigger an unnecessary redirect
  return request('/auth', {
    method: 'POST',
    body: { email, password },
    skipAuthRedirect: true,
  })
}

// Exporte aqui outras funções de API conforme necessário
