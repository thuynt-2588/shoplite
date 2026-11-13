// Dựng HTML cho trang chi tiết sản phẩm (product.html) từ DummyJSON GET /products/{id}.
import { escapeHtml, formatPrice, getOldPrice, renderStars } from "./render.js";

// Còn ít hơn hoặc bằng số này thì cảnh báo "sắp hết hàng".
const LOW_STOCK_THRESHOLD = 5;

const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

const ALERT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

const CART_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"></circle><circle cx="19" cy="20" r="1.5"></circle><path d="M1 1h4l2.6 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path></svg>`;

const formatCount = (n) => Number(n).toLocaleString("vi-VN");

// Danh sách ảnh: ưu tiên mảng images, không có thì dùng thumbnail.
export function getProductImages(product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  return images.length ? images : [product.thumbnail].filter(Boolean);
}

// ---------- Trạng thái đang tải ----------
export function renderDetailLoading(galleryEl, infoEl) {
  galleryEl.innerHTML = `<div class="gallery-main-image skeleton" aria-hidden="true"></div>`;
  const line = (width, height = 14) =>
    `<span class="skeleton skeleton-line" style="width:${width}%;height:${height}px"></span>`;
  infoEl.innerHTML = `
    <div aria-hidden="true">
      ${line(20)}
      ${line(80, 36)}
      ${line(45)}
      ${line(35, 32)}
      ${line(100)}${line(95)}${line(70)}
      ${line(40)}
      <span class="skeleton skeleton-block"></span>
    </div>
    <p class="visually-hidden">Đang tải thông tin sản phẩm…</p>`;
}

// ---------- Gallery ----------
export function productGalleryHTML(product) {
  const images = getProductImages(product);
  const title = escapeHtml(product.title);

  const main = `
    <div class="gallery-main-image bg-beige pattern-grid">
      ${
        images.length
          ? `<img class="gallery-img" id="gallery-main-img" src="${escapeHtml(images[0])}" alt="${title}" />`
          : `<span class="gallery-no-image">Chưa có ảnh</span>`
      }
    </div>`;

  // Chỉ có 1 ảnh thì không cần dải ảnh thu nhỏ.
  if (images.length < 2) return main;

  const thumbs = images
    .map(
      (src, i) => `
        <button type="button" class="thumb-btn${i === 0 ? " active" : ""}" data-index="${i}"
          aria-label="Xem ảnh ${i + 1}"${i === 0 ? ' aria-current="true"' : ""}>
          <span class="thumb-inner bg-beige pattern-grid">
            <img src="${escapeHtml(src)}" alt="" loading="lazy" />
          </span>
        </button>`,
    )
    .join("");

  return `${main}
    <nav class="gallery-thumbs" aria-label="Danh sách ảnh thu nhỏ">${thumbs}</nav>`;
}

// ---------- Tồn kho ----------
function stockStatusHTML(stock) {
  const qty = Math.max(0, Number(stock) || 0);
  if (qty === 0) {
    return `<div class="stock-status stock-status--out">${ALERT_ICON}<span>Hết hàng</span></div>`;
  }
  if (qty <= LOW_STOCK_THRESHOLD) {
    return `<div class="stock-status stock-status--low">${ALERT_ICON}<span>Sắp hết hàng &mdash; chỉ còn ${formatCount(qty)} sản phẩm</span></div>`;
  }
  return `<div class="stock-status">${CHECK_ICON}<span>Còn hàng &mdash; ${formatCount(qty)} sản phẩm</span></div>`;
}

// ---------- Thông tin chi tiết ----------
function metaRowsHTML(product) {
  const rows = [
    ["Thương hiệu", product.brand],
    ["Mã SKU", product.sku],
    ["Bảo hành", product.warrantyInformation],
    ["Vận chuyển", product.shippingInformation],
    ["Đổi trả", product.returnPolicy],
  ].filter(([, value]) => value);

  if (!rows.length) return "";
  return `
    <dl class="product-meta">
      ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
    </dl>`;
}

export function productInfoHTML(product) {
  const { title, category, price, discountPercentage, rating, description } = product;
  const stock = Math.max(0, Number(product.stock) || 0);
  const inStock = stock > 0;
  const oldPrice = getOldPrice(price, discountPercentage);
  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : 0;

  return `
    <span class="product-category-tag">${escapeHtml(String(category ?? "").toUpperCase())}</span>
    <h1 class="product-name">${escapeHtml(title)}</h1>

    <div class="product-rating-row">
      <span class="stars" aria-hidden="true">${renderStars(rating)}</span>
      <span class="rating-score">${Number(rating).toFixed(1)}</span>
      <span class="rating-count">${formatCount(reviewCount)} đánh giá</span>
    </div>

    <div class="product-price-row">
      <span class="price-current">${formatPrice(price)}</span>
      ${oldPrice ? `<span class="price-original">${formatPrice(oldPrice)}</span>` : ""}
      ${discountPercentage ? `<span class="badge-sale">-${Math.round(discountPercentage)}%</span>` : ""}
    </div>

    <p class="product-desc">${escapeHtml(description)}</p>

    ${metaRowsHTML(product)}

    ${stockStatusHTML(stock)}

    <div class="purchase-actions">
      <div class="quantity-stepper">
        <button type="button" class="qty-btn" data-step="-1" aria-label="Giảm số lượng"${inStock ? "" : " disabled"}>&minus;</button>
        <input type="number" class="qty-input" id="qty-input" value="1" min="1" max="${stock || 1}"
          aria-label="Số lượng sản phẩm"${inStock ? "" : " disabled"} />
        <button type="button" class="qty-btn" data-step="1" aria-label="Tăng số lượng"${inStock ? "" : " disabled"}>&plus;</button>
      </div>
      <button type="button" class="btn btn-primary btn-add-cart-detail"${inStock ? "" : " disabled"}>
        ${CART_ICON}<span>${inStock ? "Thêm vào giỏ" : "Hết hàng"}</span>
      </button>
    </div>`;
}

// ---------- Lỗi ----------
// kind: "not-found" (id sai / không tồn tại) | "network" (lỗi mạng, server, timeout).
export function productDetailErrorHTML(kind) {
  if (kind === "not-found") {
    return `
      <h1 class="product-detail-error-title">Không tìm thấy sản phẩm</h1>
      <p>Sản phẩm bạn tìm không tồn tại hoặc đường dẫn không hợp lệ.</p>
      <a href="index.html" class="btn btn-primary">Về cửa hàng</a>`;
  }
  return `
    <h1 class="product-detail-error-title">Không thể tải sản phẩm</h1>
    <p>Vui lòng kiểm tra kết nối mạng và thử lại.</p>
    <div class="product-detail-error-actions">
      <button type="button" class="btn btn-primary btn-retry-product">Thử lại</button>
      <a href="index.html" class="text-link">Về cửa hàng</a>
    </div>`;
}
