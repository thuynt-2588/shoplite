// Điểm vào của trang danh sách sản phẩm (index.html).
import { products } from "./data.js";
import { filterByKeyword } from "./product-utils.js";
import { renderProductGrid } from "./render.js";

const grid = document.querySelector("#product-grid");
const counter = document.querySelector("#product-count");
const searchForm = document.querySelector(".search-box");
const searchInput = document.querySelector("#search-input");

// Trạng thái hiện tại của trang — sau này thêm sort/category thì bổ sung vào đây.
const state = {
  keyword: "",
};

// Tính danh sách cần hiển thị từ dữ liệu gốc + state, rồi vẽ lại grid và số đếm.
function update() {
  const visible = filterByKeyword(products, state.keyword);
  renderProductGrid(grid, visible);
  counter.textContent = visible.length;
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
  const button = event.target.closest(".btn-add-cart");
  if (!button) return; // click vào chỗ khác trong grid → bỏ qua

  const card = button.closest(".product-card");
  const id = card.dataset.id; // luôn là chuỗi, vd "3"
  const product = products.find((p) => String(p.id) === id);

  // Ngày 3: thay bằng lưu vào localStorage.
  console.log("Thêm vào giỏ:", product);
});

update();
