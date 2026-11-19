// Product detail page
import { addToCart } from "../cart.ts";
import { initCartBadge, showAddedFeedback } from "../cart-ui.ts";
import { fetchProductById, ProductNotFoundError } from "../data.ts";
import {
  type DetailErrorKind,
  getProductImages,
  productDetailErrorHTML,
  productGalleryHTML,
  productInfoHTML,
  renderDetailLoading,
} from "../detail-render.ts";
import { eventTargetElement, mustQuery } from "../dom.ts";
import type { Product } from "../types.ts";

const layout = mustQuery("#product-detail");
const gallery = mustQuery("#product-gallery");
const info = mustQuery("#product-info");
const errorBox = mustQuery("#product-detail-error");
const breadcrumbCategory = mustQuery("#breadcrumb-category");
const breadcrumbCategoryLink = mustQuery<HTMLAnchorElement>("a", breadcrumbCategory);
const breadcrumbCurrent = mustQuery("#breadcrumb-current");

const state: { product: Product | null } = {
  product: null,
};

// Route parsing
function getProductIdFromUrl(): string | null {
  const raw = new URLSearchParams(window.location.search).get("id")?.trim();
  return raw && /^[1-9]\d*$/.test(raw) ? raw : null;
}

// Error display
function showError(kind: DetailErrorKind): void {
  layout.hidden = true;
  errorBox.innerHTML = productDetailErrorHTML(kind);
  errorBox.hidden = false;
  breadcrumbCategory.hidden = true;
  const label = kind === "not-found" ? "Không tìm thấy sản phẩm" : "Lỗi tải sản phẩm";
  breadcrumbCurrent.textContent = label;
  document.title = `${label} - MÙA.`;
}

function renderProduct(product: Product): void {
  gallery.innerHTML = productGalleryHTML(product);
  info.innerHTML = productInfoHTML(product);

  breadcrumbCategory.hidden = !product.category;
  breadcrumbCategoryLink.textContent = product.category ?? "";
  breadcrumbCurrent.textContent = product.title;
  document.title = `${product.title} - MÙA.`;
}

async function loadProduct(): Promise<void> {
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

// Gallery interactions
gallery.addEventListener("click", (event) => {
  const thumb = eventTargetElement(event)?.closest<HTMLButtonElement>(".thumb-btn");
  if (!thumb || !state.product) return;

  const index = Number(thumb.dataset.index);
  const src = getProductImages(state.product)[index];
  const mainImg = gallery.querySelector<HTMLImageElement>("#gallery-main-img");
  if (!src || !mainImg) return;

  mainImg.src = src;
  gallery.querySelectorAll(".thumb-btn").forEach((btn) => {
    const isActive = btn === thumb;
    btn.classList.toggle("active", isActive);
    if (isActive) btn.setAttribute("aria-current", "true");
    else btn.removeAttribute("aria-current");
  });
});

// Quantity controls
function clampQuantity(value: unknown): number {
  const max = Math.max(1, Number(state.product?.stock) || 1);
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(1, n)) : 1;
}

info.addEventListener("click", (event) => {
  const target = eventTargetElement(event);
  if (!target) return;
  const input = info.querySelector<HTMLInputElement>("#qty-input");

  const stepBtn = target.closest<HTMLButtonElement>(".qty-btn");
  if (stepBtn && input) {
    input.value = String(clampQuantity(Number(input.value) + Number(stepBtn.dataset.step)));
    return;
  }

  const addBtn = target.closest<HTMLButtonElement>(".btn-add-cart-detail");
  if (addBtn && state.product) {
    addToCart(state.product, clampQuantity(input?.value));
    showAddedFeedback(addBtn);
  }
});

info.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.id === "qty-input") {
    target.value = String(clampQuantity(target.value));
  }
});

// Error actions
errorBox.addEventListener("click", (event) => {
  if (eventTargetElement(event)?.closest(".btn-retry-product")) void loadProduct();
});

initCartBadge();
void loadProduct();
