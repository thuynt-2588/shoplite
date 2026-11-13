// Phần giao diện giỏ hàng dùng chung cho mọi trang:
// - badge số lượng trên icon giỏ ở header
// - phản hồi ngắn trên nút "Thêm vào giỏ" sau khi bấm
import { getCart, getCartCount, onCartChange } from "./cart.js";

const FEEDBACK_MS = 1500;

function renderBadge(cart) {
  const count = getCartCount(cart);

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.hidden = count === 0;

    // Badge có aria-hidden → đặt số lượng vào aria-label của link cho trình đọc màn hình.
    badge.closest("a")?.setAttribute("aria-label", `Giỏ hàng (${count} sản phẩm)`);
  });
}

// Gọi 1 lần khi trang tải: vẽ badge và tự cập nhật mỗi khi giỏ đổi (kể cả từ tab khác).
export function initCartBadge() {
  renderBadge(getCart());
  onCartChange(renderBadge);
}

// Đổi chữ trên nút thành "Đã thêm ✓" trong chốc lát rồi trả lại như cũ.
export function showAddedFeedback(button) {
  const label = button.querySelector("span");
  if (!label) return;

  clearTimeout(button._feedbackTimer);
  button.dataset.originalLabel ??= label.textContent;
  label.textContent = "Đã thêm ✓";
  button.classList.add("is-added");

  button._feedbackTimer = setTimeout(() => {
    label.textContent = button.dataset.originalLabel;
    button.classList.remove("is-added");
  }, FEEDBACK_MS);
}
