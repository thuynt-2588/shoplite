// Cart UI
import { getCart, getCartCount, onCartChange } from "./cart.ts";
import type { Cart } from "./types.ts";

const FEEDBACK_MS = 1500;

const feedbackTimers = new WeakMap<HTMLElement, number>();

// Cart badge
function renderBadge(cart: Cart): void {
  const count = getCartCount(cart);

  document.querySelectorAll<HTMLElement>(".cart-badge").forEach((badge) => {
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.hidden = count === 0;

    badge.closest("a")?.setAttribute("aria-label", `Giỏ hàng (${count} sản phẩm)`);
  });
}

export function initCartBadge(): void {
  renderBadge(getCart());
  onCartChange(renderBadge);
}

// Added feedback
export function showAddedFeedback(button: HTMLElement): void {
  const label = button.querySelector("span");
  if (!label) return;

  clearTimeout(feedbackTimers.get(button));
  button.dataset.originalLabel ??= label.textContent ?? "";
  label.textContent = "Đã thêm ✓";
  button.classList.add("is-added");

  feedbackTimers.set(
    button,
    window.setTimeout(() => {
      label.textContent = button.dataset.originalLabel ?? "";
      button.classList.remove("is-added");
    }, FEEDBACK_MS),
  );
}
