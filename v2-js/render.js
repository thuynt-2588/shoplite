// Dựng HTML cho card sản phẩm từ dữ liệu (data.js hôm nay, DummyJSON từ ngày 3).

const CATEGORY_LABELS = {
  ao: "Áo",
  quan: "Quần",
  "dam-vay": "Đầm & Váy",
  "ao-khoac": "Áo khoác",
  giay: "Giày",
  "phu-kien": "Phụ kiện",
};

// Màu nền ô ảnh xoay vòng theo thứ tự, giữ đúng nhịp màu của bản HTML tĩnh.
const THUMB_TONES = ["bg-beige pattern-grid", "bg-tan pattern-grid", "bg-dark"];

const HEART_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

const CART_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"></circle><circle cx="19" cy="20" r="1"></circle><path d="M1 1h4l2.6 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path></svg>`;

// Chặn chèn HTML khi dữ liệu đến từ nguồn ngoài (API) — luôn escape trước khi đưa vào innerHTML.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 290000 -> "290.000₫"
export function formatPrice(vnd) {
  return `${Math.round(vnd).toLocaleString("vi-VN")}₫`;
}

// Giá gốc trước giảm, làm tròn lên hàng nghìn: 290000 & 17% -> 350000
export function getOldPrice(price, discountPercentage) {
  if (!discountPercentage) return null;
  return Math.ceil(price / (1 - discountPercentage / 100) / 1000) * 1000;
}

// 4.6 -> "★★★★★", 4.2 -> "★★★★☆"
export function renderStars(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

export function productCardHTML(product, index = 0) {
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

// Ghi đè toàn bộ nội dung grid bằng danh sách mới (gọi lại được khi lọc/sắp xếp).
export function renderProductGrid(container, list) {
  container.innerHTML = list.length
    ? list.map((p, i) => productCardHTML(p, i)).join("")
    : `<p class="product-empty">Không tìm thấy sản phẩm phù hợp.</p>`;
}
