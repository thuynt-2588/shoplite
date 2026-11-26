import type { Product, ProductListResponse, ProductSummary } from '../types'

const PRODUCTS_URL = 'https://dummyjson.com/products'

export async function fetchProducts(): Promise<ProductSummary[]> {
  const response = await fetch(`${PRODUCTS_URL}?limit=0`)

  if (!response.ok) {
    throw new Error(`Không thể tải sản phẩm (HTTP ${response.status}).`)
  }

  const data: ProductListResponse = await response.json()

  if (
    !Array.isArray(data.products) ||
    !Number.isInteger(data.total) ||
    data.products.length < data.total
  ) {
    throw new Error('Dữ liệu sản phẩm trả về chưa đầy đủ hoặc không hợp lệ.')
  }

  return data.products
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${PRODUCTS_URL}/${id}`)

  if (response.status === 404) {
    throw new Error('Không tìm thấy sản phẩm.')
  }

  if (!response.ok) {
    throw new Error(`Không thể tải sản phẩm (HTTP ${response.status}).`)
  }

  const product: Product = await response.json()

  if (!product || product.id !== id) {
    throw new Error('Dữ liệu sản phẩm trả về không hợp lệ.')
  }

  return product
}
