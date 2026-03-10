import { request } from '../lib/api'

export async function getTransactions({ page = 1, startDate, endDate, typeTransaction } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  if (typeTransaction) params.set('typeTransaction', typeTransaction);

  return request(`/transactions?${params.toString()}`)
}

