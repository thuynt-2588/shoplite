// Lấy dữ liệu sản phẩm từ DummyJSON (https://dummyjson.com/docs/products).
const API_BASE = "https://dummyjson.com";

// Danh sách: select=... chỉ lấy các trường card cần dùng để giảm dung lượng tải (id luôn có sẵn).
const PRODUCTS_LIST_URL = `${API_BASE}/products?limit=30&select=title,price,discountPercentage,thumbnail,category,rating,stock`;

// Quá thời gian này mà chưa có phản hồi thì coi như lỗi, tránh skeleton quay mãi.
const REQUEST_TIMEOUT_MS = 10000;

// Lỗi riêng cho trường hợp API trả 404 — trang chi tiết hiển thị "không tìm thấy"
// thay vì "lỗi kết nối" và không cần nút Thử lại.
export class ProductNotFoundError extends Error {
  constructor(id) {
    super(`Không tìm thấy sản phẩm có id "${id}".`);
    this.name = "ProductNotFoundError";
  }
}

async function getJSON(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    const error = new Error(`Yêu cầu thất bại (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchProducts() {
  const data = await getJSON(PRODUCTS_LIST_URL);
  if (!Array.isArray(data.products)) {
    throw new Error("Dữ liệu sản phẩm từ API không hợp lệ.");
  }
  return data.products;
}

export async function fetchProductById(id) {
  try {
    const product = await getJSON(`${API_BASE}/products/${encodeURIComponent(id)}`);
    if (!product || product.id == null) {
      throw new Error("Dữ liệu sản phẩm từ API không hợp lệ.");
    }
    return product;
  } catch (error) {
    if (error.status === 404) throw new ProductNotFoundError(id);
    throw error;
  }
}
