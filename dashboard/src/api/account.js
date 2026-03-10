import { request } from '../lib/api'

export async function getAccount() {
  return request('/account')
}

export async function createAccount({ accountType, document }) {
  return request('/account', {
    method: 'POST',
    body: { accountType, document },
  })
}
