// Home page
import { addToCart } from "../cart.ts";
import { initCartBadge, showAddedFeedback } from "../cart-ui.ts";
import { fetchProducts } from "../data.ts";
import { eventTargetElement, mustQuery } from "../dom.ts";
import { filterByKeyword } from "../product-utils.ts";
import { renderLoadingState, renderProductError, renderProductGrid } from "../render.ts";
import type { LoadStatus, Product } from "../types.ts";

const grid = mustQuery("#product-grid");
const counter = mustQuery("#product-count");
const searchForm = mustQuery<HTMLFormElement>(".search-box");
const searchInput = mustQuery<HTMLInputElement>("#search-input");

interface HomeState {
  keyword: string;
  products: Product[];
  status: LoadStatus;
}

const state: HomeState = {
  keyword: "",
  products: [],
  status: "loading",
};

function update(): void {
  if (state.status !== "ready") return;

  const visible = filterByKeyword(state.products, state.keyword);
  renderProductGrid(grid, visible);
  counter.textContent = String(visible.length);
}

// Product loading
async function loadProducts(): Promise<void> {
  state.status = "loading";
  grid.setAttribute("aria-busy", "true");
  counter.textContent = "…";
  renderLoadingState(grid);

  try {
    state.products = await fetchProducts();
    state.status = "ready";
    update();
  } catch (error) {
    console.error("Không thể tải danh sách sản phẩm:", error);
    state.status = "error";
    counter.textContent = "0";
    renderProductError(grid);
  } finally {
    grid.setAttribute("aria-busy", "false");
  }
}

// Search events
searchInput.addEventListener("input", () => {
  state.keyword = searchInput.value;
  update();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

// Grid events
grid.addEventListener("click", (event) => {
  const target = eventTargetElement(event);
  if (!target) return;

  if (target.closest(".btn-retry-products")) {
    void loadProducts();
    return;
  }

  const button = target.closest<HTMLButtonElement>(".btn-add-cart");
  if (!button) return;

  const id = button.closest<HTMLElement>(".product-card")?.dataset.id;
  const product = state.products.find((p) => String(p.id) === id);
  if (!product) return;

  addToCart(product, 1);
  showAddedFeedback(button);
});

initCartBadge();
void loadProducts();
