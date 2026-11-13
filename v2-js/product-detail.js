// Điểm vào của trang chi tiết sản phẩm (product.html?id=...).
import { addToCart } from "./cart.js";
import { initCartBadge, showAddedFeedback } from "./cart-ui.js";
import { fetchProductById, ProductNotFoundError } from "./data.js";
import {
  getProductImages,
  productDetailErrorHTML,
  productGalleryHTML,
  productInfoHTML,
  renderDetailLoading,
} from "./detail-render.js";

const layout = document.querySelector("#product-detail");
const gallery = document.querySelector("#product-gallery");
const info = document.querySelector("#product-info");
const errorBox = document.querySelector("#product-detail-error");
const breadcrumbCategory = document.querySelector("#breadcrumb-category");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");

const state = {
  product: null,
};

// Chỉ chấp nhận id là số nguyên dương: "?id=5" → "5"; thiếu, "abc", "-1", "1.5" → null.
function getProductIdFromUrl() {
  const raw = new URLSearchParams(window.location.search).get("id")?.trim();
  return raw && /^[1-9]\d*$/.test(raw) ? raw : null;
}

function showError(kind) {
  layout.hidden = true;
  errorBox.innerHTML = productDetailErrorHTML(kind);
  errorBox.hidden = false;
  breadcrumbCategory.hidden = true;
  const label = kind === "not-found" ? "Không tìm thấy sản phẩm" : "Lỗi tải sản phẩm";
  breadcrumbCurrent.textContent = label;
  document.title = `${label} - MÙA.`;
}

function renderProduct(product) {
  gallery.innerHTML = productGalleryHTML(product);
  info.innerHTML = productInfoHTML(product);

  breadcrumbCategory.hidden = !product.category;
  breadcrumbCategory.querySelector("a").textContent = product.category ?? "";
  breadcrumbCurrent.textContent = product.title;
  document.title = `${product.title} - MÙA.`;
}

async function loadProduct() {
  const id = getProductIdFromUrl();
  if (!id) {
    showError("not-found");
    return;
  }

  errorBox.hidden = true;
  layout.hidden = false;
  layout.setAttribute("aria-busy", "true");
  renderDetailLoading(gallery, info);

  try {
    state.product = await fetchProductById(id);
    renderProduct(state.product);
  } catch (error) {
    console.error("Không thể tải sản phẩm:", error);
    showError(error instanceof ProductNotFoundError ? "not-found" : "network");
  } finally {
    layout.setAttribute("aria-busy", "false");
  }
}

// ---------- Tương tác (event delegation vì nội dung được vẽ lại bằng innerHTML) ----------

// Đổi ảnh chính khi bấm ảnh thu nhỏ.
gallery.addEventListener("click", (event) => {
  const thumb = event.target.closest(".thumb-btn");
  if (!thumb || !state.product) return;

  const index = Number(thumb.dataset.index);
  const src = getProductImages(state.product)[index];
  const mainImg = gallery.querySelector("#gallery-main-img");
  if (!src || !mainImg) return;

  mainImg.src = src;
  gallery.querySelectorAll(".thumb-btn").forEach((btn) => {
    const isActive = btn === thumb;
    btn.classList.toggle("active", isActive);
    if (isActive) btn.setAttribute("aria-current", "true");
    else btn.removeAttribute("aria-current");
  });
});

// Giữ số lượng trong khoảng 1..tồn kho.
function clampQuantity(value) {
  const max = Math.max(1, Number(state.product?.stock) || 1);
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(1, n)) : 1;
}

info.addEventListener("click", (event) => {
  const input = info.querySelector("#qty-input");

  const stepBtn = event.target.closest(".qty-btn");
  if (stepBtn && input) {
    input.value = clampQuantity(Number(input.value) + Number(stepBtn.dataset.step));
    return;
  }

  const addBtn = event.target.closest(".btn-add-cart-detail");
  if (addBtn && state.product) {
    addToCart(state.product, clampQuantity(input?.value));
    showAddedFeedback(addBtn);
  }
});

// Người dùng gõ tay số lượng → chuẩn hoá khi rời ô nhập.
info.addEventListener("change", (event) => {
  if (event.target.matches("#qty-input")) {
    event.target.value = clampQuantity(event.target.value);
  }
});

errorBox.addEventListener("click", (event) => {
  if (event.target.closest(".btn-retry-product")) loadProduct();
});

initCartBadge();
loadProduct();
