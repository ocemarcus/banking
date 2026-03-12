import { request } from '../lib/api'

export async function getAccount() {
  const res = await request('/account')
  if (!res) return res

  const safeNumber = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n / 100 : 0
  }

  if (Array.isArray(res.data)) {
    const data = res.data.map((item) => ({
      ...item,
      balance: safeNumber(item.balance),
    }))
    return { ...res, data }
  }

  return res
}

export async function createAccount({ accountType, document }) {
  return request('/account', {
    method: 'POST',
    body: { accountType, document },
  })
}

export async function getAccountDetail(accountNumber) {
  return request(`/account/detail/${accountNumber}`)
}
