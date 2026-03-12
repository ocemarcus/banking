import { request } from '../lib/api'

export async function getTransactions({ page = 1, startDate, endDate, typeTransaction } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  if (typeTransaction) params.set('typeTransaction', typeTransaction);

  const res = await request(`/transactions?${params.toString()}`)
  if (!res) return res

  const safeNumber = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n / 100 : 0
  }

  if (Array.isArray(res.data)) {
    const data = res.data.map((item) => ({
      ...item,
      amount: safeNumber(item.amount),
    }))
    return { ...res, data }
  }

  return res
}

