// Product rendering
import type { ProductSummary } from "./types.ts";

const CATEGORY_LABELS: Record<string, string> = {
  ao: "Áo",
  quan: "Quần",
  "dam-vay": "Đầm & Váy",
  "ao-khoac": "Áo khoác",
  giay: "Giày",
  "phu-kien": "Phụ kiện",
};

const THUMB_TONES = ["bg-beige pattern-grid", "bg-tan pattern-grid", "bg-dark"] as const;

const HEART_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

const CART_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"></circle><circle cx="19" cy="20" r="1"></circle><path d="M1 1h4l2.6 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path></svg>`;

// HTML escaping
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Price formatting
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function getOldPrice(price: number, discountPercentage?: number): number | null {
  if (!discountPercentage) return null;
  return price / (1 - discountPercentage / 100);
}

// Rating
export function renderStars(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

// Product cards and grid states
export function productCardHTML(product: ProductSummary, index: number = 0): string {
  const { id, title, price, thumbnail, category, rating, discountPercentage } = product;
  const oldPrice = getOldPrice(price, discountPercentage);
  const label = CATEGORY_LABELS[category] ?? category;
  const tone = THUMB_TONES[index % THUMB_TONES.length];
  const href = `product.html?id=${encodeURIComponent(id)}`;

  return `
    <article class="product-card" data-id="${escapeHtml(id)}">
      <div class="card-thumb ${tone}">
        ${discountPercentage ? `<span class="badge-discount">-${Math.round(discountPercentage)}%</span>` : ""}
        <button type="button" class="wishlist-btn" aria-label="Lưu sản phẩm">${HEART_ICON}</button>
        <img class="card-img" src="${escapeHtml(thumbnail)}" alt="${escapeHtml(title)}" loading="lazy" />
      </div>

      <div class="card-details">
        <span class="product-cat">${escapeHtml(label.toUpperCase())}</span>
        <h3 class="product-title">
          <a href="${href}">${escapeHtml(title)}</a>
        </h3>
        <div class="rating-wrap">
          <span class="stars" aria-hidden="true">${renderStars(rating)}</span>
          <span class="rating-val">${Number(rating).toFixed(1)}</span>
        </div>
        <p class="price-wrap">
          <span class="current-price">${formatPrice(price)}</span>
          ${oldPrice ? `<span class="old-price">${formatPrice(oldPrice)}</span>` : ""}
        </p>
        <button type="button" class="btn-add-cart">${CART_ICON}<span>Thêm vào giỏ</span></button>
      </div>
    </article>`;
}

export function renderProductGrid(container: HTMLElement, list: readonly ProductSummary[]): void {
  container.innerHTML = list.length
    ? list.map((p, i) => productCardHTML(p, i)).join("")
    : `<p class="product-empty">Không tìm thấy sản phẩm phù hợp.</p>`;
}

export function renderLoadingState(container: HTMLElement, count: number = 8): void {
  container.innerHTML = Array.from(
    { length: count },
    () => `
      <article class="product-card skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton-thumb"></div>
        <div class="card-details">
          <span class="skeleton skeleton-line skeleton-category"></span>
          <span class="skeleton skeleton-line skeleton-title"></span>
          <span class="skeleton skeleton-line skeleton-rating"></span>
          <span class="skeleton skeleton-line skeleton-price"></span>
          <span class="skeleton skeleton-button"></span>
        </div>
      </article>`,
  ).join("");
}

export function renderProductError(container: HTMLElement): void {
  container.innerHTML = `
    <div class="product-error" role="alert">
      <p>Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối và thử lại.</p>
      <button type="button" class="btn-retry-products">Thử lại</button>
    </div>`;
}
