// Logic giỏ hàng — lưu trong localStorage, KHÔNG đụng tới DOM.
// Mọi trang (danh sách, chi tiết, giỏ hàng) đều đọc/ghi giỏ qua các hàm ở đây.
//
// Cấu trúc mỗi dòng trong giỏ (lưu bản chụp thông tin sản phẩm để trang giỏ
// render được ngay, không cần gọi lại API):
//   { id, title, price, thumbnail, stock, quantity }

const STORAGE_KEY = "shoplite:cart";

// Tên sự kiện bắn ra trên window mỗi khi giỏ thay đổi (trong cùng tab).
// Tab khác sẽ nhận được sự kiện "storage" của trình duyệt — xem onCartChange.
export const CART_CHANGE_EVENT = "cart:change";

// Không biết tồn kho thì vẫn đặt trần để tránh số lượng vô lý.
const DEFAULT_MAX_QTY = 99;

function maxQtyOf(item) {
  const stock = Math.floor(Number(item.stock));
  return stock > 0 ? stock : DEFAULT_MAX_QTY;
}

// Ép số lượng về số nguyên trong khoảng 1..tồn kho.
function clampQty(item, qty) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n)) return 1;
  return Math.min(maxQtyOf(item), Math.max(1, n));
}

// Dữ liệu trong localStorage có thể bị sửa tay / hỏng → chỉ giữ những dòng hợp lệ.
function sanitize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && item.id != null && Number.isFinite(Number(item.price)))
    .map((item) => ({
      id: item.id,
      title: String(item.title ?? ""),
      price: Number(item.price),
      thumbnail: String(item.thumbnail ?? ""),
      stock: Number(item.stock) || 0,
      quantity: clampQty(item, item.quantity),
    }));
}

// ---------- Đọc / ghi ----------

export function getCart() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    // JSON hỏng hoặc trình duyệt chặn storage → coi như giỏ rỗng.
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Không thể lưu giỏ hàng:", error);
  }
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: { cart } }));
  return cart;
}

const sameId = (a, b) => String(a) === String(b);

// ---------- Thao tác ----------

// Đã có trong giỏ → cộng dồn quantity; chưa có → thêm dòng mới. Trả về giỏ mới.
export function addToCart(product, quantity = 1) {
  if (!product || product.id == null) throw new Error("addToCart: thiếu sản phẩm.");

  const cart = getCart();
  const existing = cart.find((item) => sameId(item.id, product.id));

  if (existing) {
    // Cập nhật lại thông tin mới nhất từ API (giá, tồn kho có thể đã đổi).
    Object.assign(existing, {
      title: product.title,
      price: Number(product.price),
      thumbnail: product.thumbnail ?? existing.thumbnail,
      stock: Number(product.stock) || existing.stock,
    });
    existing.quantity = clampQty(existing, existing.quantity + Number(quantity));
  } else {
    const item = {
      id: product.id,
      title: String(product.title ?? ""),
      price: Number(product.price),
      thumbnail: String(product.thumbnail ?? ""),
      stock: Number(product.stock) || 0,
    };
    item.quantity = clampQty(item, quantity);
    cart.push(item);
  }

  return saveCart(cart);
}

export function removeFromCart(id) {
  return saveCart(getCart().filter((item) => !sameId(item.id, id)));
}

// Đặt số lượng mới cho 1 dòng. qty < 1 → xoá dòng đó khỏi giỏ.
export function updateQty(id, qty) {
  if (Number(qty) < 1) return removeFromCart(id);

  const cart = getCart();
  const item = cart.find((i) => sameId(i.id, id));
  if (!item) return cart;

  item.quantity = clampQty(item, qty);
  return saveCart(cart);
}

export function clearCart() {
  return saveCart([]);
}

// ---------- Tính toán (hàm thuần, nhận giỏ làm tham số) ----------

// Tổng tiền hàng (chưa tính phí vận chuyển), làm tròn 2 chữ số (USD).
export function getCartTotal(cart = getCart()) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
}

// Tổng số lượng sản phẩm — dùng cho badge ở header.
export function getCartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Đăng ký lắng nghe thay đổi giỏ: cả trong tab hiện tại lẫn từ tab khác.
export function onCartChange(callback) {
  window.addEventListener(CART_CHANGE_EVENT, () => callback(getCart()));
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) callback(getCart());
  });
}
