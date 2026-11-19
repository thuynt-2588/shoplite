import type { Cart, CartItem, CartProductInput, ProductId } from "./types.ts";

const STORAGE_KEY = "shoplite:cart";

export const CART_CHANGE_EVENT = "cart:change";

export interface CartChangeDetail {
  cart: Cart;
}

declare global {
  interface WindowEventMap {
    [CART_CHANGE_EVENT]: CustomEvent<CartChangeDetail>;
  }
}

export const DEFAULT_MAX_QTY = 99;

export function maxQtyOf(item: Pick<CartItem, "stock">): number {
  const stock = Math.floor(Number(item.stock));
  return stock > 0 ? stock : DEFAULT_MAX_QTY;
}

function clampQty(item: Pick<CartItem, "stock">, qty: unknown): number {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n)) return 1;
  return Math.min(maxQtyOf(item), Math.max(1, n));
}

function sanitize(raw: unknown): Cart {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry: unknown): CartItem[] => {
    if (typeof entry !== "object" || entry === null) return [];
    const item = entry as Record<string, unknown>;

    const id = Number(item.id);
    const price = Number(item.price);
    if (item.id == null || !Number.isFinite(id) || !Number.isFinite(price)) return [];

    const stock = Number(item.stock) || 0;
    return [
      {
        id,
        title: String(item.title ?? ""),
        price,
        thumbnail: String(item.thumbnail ?? ""),
        stock,
        quantity: clampQty({ stock }, item.quantity),
      },
    ];
  });
}

export function getCart(): Cart {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

function saveCart(cart: Cart): Cart {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Không thể lưu giỏ hàng:", error);
  }
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: { cart } }));
  return cart;
}

const sameId = (a: ProductId | string, b: ProductId | string): boolean => String(a) === String(b);

export function addToCart(product: CartProductInput, quantity: number = 1): CartItem[] {
  if (!product || product.id == null) throw new Error("addToCart: thiếu sản phẩm.");

  const cart = getCart();
  const existing = cart.find((item) => sameId(item.id, product.id));

  if (existing) {
    existing.title = product.title;
    existing.price = Number(product.price);
    existing.thumbnail = product.thumbnail ?? existing.thumbnail;
    existing.stock = Number(product.stock) || existing.stock;
    existing.quantity = clampQty(existing, existing.quantity + Number(quantity));
  } else {
    const stock = Number(product.stock) || 0;
    cart.push({
      id: product.id,
      title: String(product.title ?? ""),
      price: Number(product.price),
      thumbnail: String(product.thumbnail ?? ""),
      stock,
      quantity: clampQty({ stock }, quantity),
    });
  }

  return saveCart(cart);
}

export function removeFromCart(id: ProductId | string): CartItem[] {
  return saveCart(getCart().filter((item) => !sameId(item.id, id)));
}

export function updateQty(id: ProductId | string, qty: number): CartItem[] {
  if (qty < 1) return removeFromCart(id);

  const cart = getCart();
  const item = cart.find((i) => sameId(i.id, id));
  if (!item) return cart;

  item.quantity = clampQty(item, qty);
  return saveCart(cart);
}

export function clearCart(): Cart {
  return saveCart([]);
}

export function getCartTotal(cart: readonly CartItem[] = getCart()): number {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
}

export function getCartCount(cart: readonly CartItem[] = getCart()): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function onCartChange(callback: (cart: Cart) => void): void {
  window.addEventListener(CART_CHANGE_EVENT, () => callback(getCart()));
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) callback(getCart());
  });
}
