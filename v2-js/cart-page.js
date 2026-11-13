// Điểm vào của trang giỏ hàng (cart.html).
// Đọc giỏ từ localStorage (qua cart.js), render từng dòng, xử lý tăng/giảm/xoá
// và tính lại tổng tiền sau mỗi thao tác.
import {
  getCart,
  getCartCount,
  getCartTotal,
  onCartChange,
  removeFromCart,
  updateQty,
} from "./cart.js";
import { initCartBadge } from "./cart-ui.js";
import { escapeHtml, formatPrice } from "./render.js";

// Giá DummyJSON tính bằng USD nên ngưỡng freeship & phí ship cũng để USD.
const FREESHIP_THRESHOLD = 100;
const SHIPPING_FEE = 5;

const TRASH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`;

const el = {
  count: document.querySelector("#cart-count"),
  empty: document.querySelector("#cart-empty"),
  layout: document.querySelector("#cart-layout"),
  items: document.querySelector("#cart-items"),
  freeshipMessage: document.querySelector("#freeship-message"),
  freeshipBar: document.querySelector("#freeship-bar"),
  freeshipFill: document.querySelector("#freeship-fill"),
  subtotal: document.querySelector("#summary-subtotal"),
  shipping: document.querySelector("#summary-shipping"),
  total: document.querySelector("#summary-total"),
};

const maxQtyOf = (item) => (item.stock > 0 ? item.stock : 99);

// ---------- Render ----------

function cartItemHTML(item) {
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

function renderFreeship(subtotal) {
  const remaining = Math.max(0, FREESHIP_THRESHOLD - subtotal);
  const percent = Math.min(100, (subtotal / FREESHIP_THRESHOLD) * 100);

  el.freeshipMessage.innerHTML = remaining
    ? `Mua thêm <strong>${formatPrice(remaining)}</strong> để được <strong>miễn phí vận chuyển</strong>`
    : `Bạn đã được <strong>miễn phí vận chuyển</strong>!`;
  el.freeshipFill.style.width = `${percent}%`;
  el.freeshipBar.setAttribute("aria-valuemax", String(FREESHIP_THRESHOLD));
  el.freeshipBar.setAttribute("aria-valuenow", String(Math.min(subtotal, FREESHIP_THRESHOLD)));
}

function render(cart) {
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

// ---------- Giữ focus khi danh sách được vẽ lại ----------
// innerHTML thay toàn bộ nút → focus bị mất. Ghi nhớ nút đang thao tác rồi focus lại.

function rememberFocus(target) {
  const row = target.closest(".cart-item");
  const action = target.dataset.action ?? (target.matches(".qty-input") ? "input" : null);
  return row && action ? { id: row.dataset.id, action, index: [...el.items.children].indexOf(row) } : null;
}

function restoreFocus(saved) {
  if (!saved) return;
  const rows = [...el.items.children];
  const row = rows.find((r) => r.dataset.id === saved.id);

  if (row) {
    const selector = saved.action === "input" ? ".qty-input" : `[data-action="${saved.action}"]`;
    const target = row.querySelector(selector);
    // Nút vừa bị disabled (vd đã về 1) → chuyển focus sang ô số lượng cùng dòng.
    (target && !target.disabled ? target : row.querySelector(".qty-input"))?.focus();
    return;
  }

  // Dòng vừa bị xoá → focus nút Xóa của dòng kế tiếp (hoặc dòng cuối), giỏ rỗng → nút mua tiếp.
  const next = rows[Math.min(saved.index, rows.length - 1)];
  (next?.querySelector(".btn-remove") ?? el.empty.querySelector("a"))?.focus();
}

function withFocus(target, action) {
  const saved = rememberFocus(target);
  action(); // cart.js lưu giỏ → bắn sự kiện thay đổi → render() chạy đồng bộ
  restoreFocus(saved);
}

// ---------- Sự kiện ----------

const findItem = (id) => getCart().find((item) => String(item.id) === id);

el.items.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;

  const id = button.closest(".cart-item").dataset.id;
  const item = findItem(id);
  if (!item) return;

  withFocus(button, () => {
    if (button.dataset.action === "increase") updateQty(id, item.quantity + 1);
    if (button.dataset.action === "decrease") updateQty(id, Math.max(1, item.quantity - 1));
    if (button.dataset.action === "remove") removeFromCart(id);
  });
});

// Gõ tay số lượng: áp dụng khi rời ô / nhấn Enter. Nhập 0 hoặc rỗng → giữ tối thiểu 1
// (muốn bỏ sản phẩm thì dùng nút Xóa).
el.items.addEventListener("change", (event) => {
  const input = event.target.closest(".qty-input");
  if (!input) return;

  const id = input.closest(".cart-item").dataset.id;
  const qty = Math.max(1, Math.floor(Number(input.value)) || 1);

  // "change" bắn ra trước khi focus rời ô (vd khi bấm Tab). Đợi focus chuyển xong
  // rồi mới vẽ lại, để giữ focus ở đúng chỗ người dùng vừa Tab tới.
  setTimeout(() => withFocus(document.activeElement, () => updateQty(id, qty)));
});

// ---------- Khởi động ----------

initCartBadge();
render(getCart());
onCartChange(render); // cập nhật cả khi giỏ đổi ở tab khác
