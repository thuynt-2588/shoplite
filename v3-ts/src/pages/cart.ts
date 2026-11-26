// Cart page
import {
  getCart,
  getCartCount,
  getCartTotal,
  maxQtyOf,
  onCartChange,
  removeFromCart,
  updateQty,
} from "../cart.ts";
import { initCartBadge } from "../cart-ui.ts";
import { eventTargetElement, mustQuery } from "../dom.ts";
import { escapeHtml, formatPrice } from "../render.ts";
import type { Cart, CartItem } from "../types.ts";

// Shipping thresholds
const FREESHIP_THRESHOLD = 100;
const SHIPPING_FEE = 5;

const TRASH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`;

const el = {
  count: mustQuery("#cart-count"),
  empty: mustQuery("#cart-empty"),
  layout: mustQuery("#cart-layout"),
  items: mustQuery("#cart-items"),
  freeshipMessage: mustQuery("#freeship-message"),
  freeshipBar: mustQuery("#freeship-bar"),
  freeshipFill: mustQuery("#freeship-fill"),
  subtotal: mustQuery("#summary-subtotal"),
  shipping: mustQuery("#summary-shipping"),
  total: mustQuery("#summary-total"),
};

type ItemAction = "increase" | "decrease" | "remove";
type FocusAction = ItemAction | "input";

// Cart rendering
function cartItemHTML(item: CartItem): string {
  const href = `product.html?id=${encodeURIComponent(item.id)}`;
  const title = escapeHtml(item.title);
  const max = maxQtyOf(item);
  const atMax = item.quantity >= max;

  return `
    <li class="cart-item" data-id="${escapeHtml(item.id)}">
      <a href="${href}" class="item-thumb bg-beige pattern-grid" aria-hidden="true" tabindex="-1">
        ${item.thumbnail ? `<img src="${escapeHtml(item.thumbnail)}" alt="" loading="lazy" />` : ""}
      </a>

      <div class="item-info">
        <h3 class="item-name"><a href="${href}">${title}</a></h3>
        ${atMax && item.stock > 0 ? `<p class="item-stock-note">Chỉ còn ${item.stock} sản phẩm trong kho</p>` : ""}
        <div class="item-actions">
          <div class="quantity-stepper">
            <button type="button" class="qty-btn" data-action="decrease"
              aria-label="Giảm số lượng ${title}"${item.quantity <= 1 ? " disabled" : ""}>&minus;</button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${max}"
              aria-label="Số lượng ${title}" />
            <button type="button" class="qty-btn" data-action="increase"
              aria-label="Tăng số lượng ${title}"${atMax ? " disabled" : ""}>&plus;</button>
          </div>
          <button type="button" class="btn-remove" data-action="remove" aria-label="Xóa ${title} khỏi giỏ">
            ${TRASH_ICON}<span>Xóa</span>
          </button>
        </div>
      </div>

      <div class="item-price">
        <span class="line-total">${formatPrice(item.price * item.quantity)}</span>
        <span class="unit-price">${formatPrice(item.price)} / sp</span>
      </div>
    </li>`;
}

function renderFreeship(subtotal: number): void {
  const remaining = Math.max(0, FREESHIP_THRESHOLD - subtotal);
  const percent = Math.min(100, (subtotal / FREESHIP_THRESHOLD) * 100);

  el.freeshipMessage.innerHTML = remaining
    ? `Mua thêm <strong>${formatPrice(remaining)}</strong> để được <strong>miễn phí vận chuyển</strong>`
    : `Bạn đã được <strong>miễn phí vận chuyển</strong>!`;
  el.freeshipFill.style.width = `${percent}%`;
  el.freeshipBar.setAttribute("aria-valuemax", String(FREESHIP_THRESHOLD));
  el.freeshipBar.setAttribute("aria-valuenow", String(Math.min(subtotal, FREESHIP_THRESHOLD)));
}

function render(cart: Cart): void {
  const count = getCartCount(cart);
  el.count.textContent = count ? `(${count})` : "";

  const isEmpty = cart.length === 0;
  el.empty.hidden = !isEmpty;
  el.layout.hidden = isEmpty;
  if (isEmpty) {
    el.items.innerHTML = "";
    return;
  }

  el.items.innerHTML = cart.map(cartItemHTML).join("");

  const subtotal = getCartTotal(cart);
  const shipping = subtotal >= FREESHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  el.subtotal.textContent = formatPrice(subtotal);
  el.shipping.textContent = shipping ? formatPrice(shipping) : "Miễn phí";
  el.total.textContent = formatPrice(subtotal + shipping);
  renderFreeship(subtotal);
}

// Focus restoration
interface SavedFocus {
  id: string;
  action: FocusAction;
  index: number;
}

const itemRows = (): HTMLElement[] => [...el.items.querySelectorAll<HTMLElement>(":scope > .cart-item")];

function rememberFocus(target: Element | null): SavedFocus | null {
  if (!(target instanceof HTMLElement)) return null;
  const row = target.closest<HTMLElement>(".cart-item");
  const action = (target.dataset.action as ItemAction | undefined) ??
    (target.matches(".qty-input") ? "input" : null);
  const id = row?.dataset.id;
  return row && id && action ? { id, action, index: itemRows().indexOf(row) } : null;
}

function restoreFocus(saved: SavedFocus | null): void {
  if (!saved) return;
  const rows = itemRows();
  const row = rows.find((r) => r.dataset.id === saved.id);

  if (row) {
    const selector = saved.action === "input" ? ".qty-input" : `[data-action="${saved.action}"]`;
    const target = row.querySelector<HTMLButtonElement | HTMLInputElement>(selector);
    (target && !target.disabled ? target : row.querySelector<HTMLInputElement>(".qty-input"))?.focus();
    return;
  }

  const next = rows[Math.min(saved.index, rows.length - 1)];
  (
    next?.querySelector<HTMLButtonElement>(".btn-remove") ??
    el.empty.querySelector<HTMLAnchorElement>("a")
  )?.focus();
}

function withFocus(target: Element | null, action: () => void): void {
  const saved = rememberFocus(target);
  action();
  restoreFocus(saved);
}

// Cart events
const findItem = (id: string): CartItem | undefined =>
  getCart().find((item) => String(item.id) === id);

el.items.addEventListener("click", (event) => {
  const button = eventTargetElement(event)?.closest<HTMLButtonElement>("button[data-action]");
  if (!button || button.disabled) return;

  const id = button.closest<HTMLElement>(".cart-item")?.dataset.id;
  const item = id ? findItem(id) : undefined;
  if (!id || !item) return;

  const action = button.dataset.action as ItemAction;
  withFocus(button, () => {
    switch (action) {
      case "increase":
        updateQty(id, item.quantity + 1);
        break;
      case "decrease":
        updateQty(id, Math.max(1, item.quantity - 1));
        break;
      case "remove":
        removeFromCart(id);
        break;
    }
  });
});

el.items.addEventListener("change", (event) => {
  const input = eventTargetElement(event)?.closest<HTMLInputElement>(".qty-input");
  const id = input?.closest<HTMLElement>(".cart-item")?.dataset.id;
  if (!input || !id) return;

  const qty = Math.max(1, Math.floor(Number(input.value)) || 1);

  setTimeout(() => withFocus(document.activeElement, () => updateQty(id, qty)));
});

// Initialization
initCartBadge();
render(getCart());
onCartChange(render); // cập nhật cả khi giỏ đổi ở tab khác
