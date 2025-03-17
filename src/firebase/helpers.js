import { query, where, orderBy, limit } from 'firebase/firestore'

const DEFAULT_QUERY_PARAMS = {
  sortBy: 'name',
  order: 'asc',
  limit: null,
  roaster: null,
  region: null,
}

export const buildCoffeeQuery = (baseQuery, queryParams = {}) => {
  const params = { ...DEFAULT_QUERY_PARAMS, ...queryParams }
  const { sortBy = 'name', order = 'asc', limit: limitCount, roaster, region } = params
  const constraints = []

  if (sortBy) constraints.push(orderBy(sortBy, order || 'asc'))
  if (limitCount) constraints.push(limit(limitCount))
  if (roaster) constraints.push(where('roaster', '==', roaster))
  if (region) constraints.push(where('regions', 'array-contains', region))

  return constraints.length > 0 ? query(baseQuery, ...constraints) : baseQuery
}
