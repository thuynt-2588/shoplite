import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../api/products'

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Number.isSafeInteger(id) && id > 0,
  })
}
