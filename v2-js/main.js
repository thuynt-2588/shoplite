// Điểm vào của trang danh sách sản phẩm (index.html).
import { addToCart } from "./cart.js";
import { initCartBadge, showAddedFeedback } from "./cart-ui.js";
import { fetchProducts } from "./data.js";
import { filterByKeyword } from "./product-utils.js";
import {
  renderLoadingState,
  renderProductError,
  renderProductGrid,
} from "./render.js";

const grid = document.querySelector("#product-grid");
const counter = document.querySelector("#product-count");
const searchForm = document.querySelector(".search-box");
const searchInput = document.querySelector("#search-input");

// Trạng thái hiện tại của trang — sau này thêm sort/category thì bổ sung vào đây.
const state = {
  keyword: "",
  products: [],
  status: "loading", // "loading" | "ready" | "error"
};

// Tính danh sách cần hiển thị từ dữ liệu gốc + state, rồi vẽ lại grid và số đếm.
function update() {
  // Đang tải hoặc lỗi thì giữ nguyên skeleton/thông báo lỗi; từ khoá vẫn được lưu
  // trong state và sẽ được áp dụng ngay khi dữ liệu về.
  if (state.status !== "ready") return;

  const visible = filterByKeyword(state.products, state.keyword);
  renderProductGrid(grid, visible);
  counter.textContent = visible.length;
}

async function loadProducts() {
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

// "input" bắn ra mỗi lần nội dung đổi: gõ, xoá, dán, bấm nút ✕ của ô search.
searchInput.addEventListener("input", (event) => {
  state.keyword = event.target.value;
  update();
});

// Enter không tải lại trang — kết quả đã được lọc sẵn khi gõ.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

// Event delegation: một listener duy nhất trên grid thay vì gắn cho từng nút.
// Card bị innerHTML vẽ lại mỗi lần lọc, nên listener gắn trên từng nút sẽ mất —
// còn listener trên grid (phần tử cha cố định) thì vẫn bắt được click từ card mới.
grid.addEventListener("click", (event) => {
  if (event.target.closest(".btn-retry-products")) {
    loadProducts();
    return;
  }

  const button = event.target.closest(".btn-add-cart");
  if (!button) return; // click vào chỗ khác trong grid → bỏ qua

  const card = button.closest(".product-card");
  const id = card.dataset.id; // luôn là chuỗi, vd "3"
  const product = state.products.find((p) => String(p.id) === id);
  if (!product) return;

  addToCart(product, 1);
  showAddedFeedback(button);
});

initCartBadge();
loadProducts();
