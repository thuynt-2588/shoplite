// Các hàm thuần (pure) thao tác trên mảng sản phẩm.
// Không sửa mảng đầu vào, luôn trả về mảng mới — dùng được cho cả data.js lẫn dữ liệu từ API.

// Chuẩn hoá chuỗi để so khớp: chữ thường, bỏ dấu tiếng Việt, gộp khoảng trắng.
// "Áo Thun" -> "ao thun", "Đầm" -> "dam"
function normalize(str) {
  return String(str ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Lọc sản phẩm có title chứa từ khoá q (không phân biệt hoa thường, không phân biệt dấu).
// q rỗng/chỉ có khoảng trắng -> trả về bản sao toàn bộ list.
export function filterByKeyword(list, q) {
  const keyword = normalize(q);
  if (!keyword) return [...list];
  return list.filter((p) => normalize(p.title).includes(keyword));
}

// Sắp xếp theo giá. dir: "asc" (tăng dần, mặc định) | "desc" (giảm dần).
// Dùng bản sao nên không làm thay đổi thứ tự của list gốc.
export function sortByPrice(list, dir = "asc") {
  const sign = dir === "desc" ? -1 : 1;
  return [...list].sort((a, b) => (a.price - b.price) * sign);
}
