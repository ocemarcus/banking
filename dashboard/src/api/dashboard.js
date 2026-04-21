import { request } from '../lib/api'

export async function getDashboard() {
  const data = await request('/dashboard')
  if (!data) return data

  const safeNumber = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n / 100 : 0
  }

  return {
    // preserve other fields but ensure numeric money fields are converted to units
    ...data,
    balance: safeNumber(data.balance),
    totalIn: safeNumber(data.totalIn),
    totalOut: safeNumber(data.totalOut),
  }
}

export default { getDashboard }
