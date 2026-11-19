// Product API
import type { Product, ProductListResponse } from "./types.ts";

const API_BASE = "https://dummyjson.com";

const PRODUCTS_LIST_URL = `${API_BASE}/products?limit=30`;
const REQUEST_TIMEOUT_MS = 10000;

// API errors
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Yêu cầu thất bại (HTTP ${status}).`);
    this.name = "HttpError";
    this.status = status;
  }
}

export class ProductNotFoundError extends Error {
  constructor(id: string | number) {
    super(`Không tìm thấy sản phẩm có id "${id}".`);
    this.name = "ProductNotFoundError";
  }
}

// JSON requests
async function getJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new HttpError(response.status);
  return (await response.json()) as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await getJSON<Partial<ProductListResponse>>(PRODUCTS_LIST_URL);
  if (!Array.isArray(data.products)) {
    throw new Error("Dữ liệu sản phẩm từ API không hợp lệ.");
  }
  return data.products;
}

export async function fetchProductById(id: string | number): Promise<Product> {
  try {
    const product = await getJSON<Product | null>(
      `${API_BASE}/products/${encodeURIComponent(id)}`,
    );
    if (!product || product.id == null) {
      throw new Error("Dữ liệu sản phẩm từ API không hợp lệ.");
    }
    return product;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) throw new ProductNotFoundError(id);
    throw error;
  }
}
