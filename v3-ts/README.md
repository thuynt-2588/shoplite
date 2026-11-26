# ShopLite v3 — TypeScript + Vite

Phiên bản TypeScript của `v2-js`, dựng bằng Vite (template `vanilla-ts`). Giao diện và hành vi giữ nguyên.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc (kiểm tra kiểu, strict) + vite build → dist/
npm run preview  # xem bản build
```

## Cấu trúc

```
index.html, product.html, cart.html   # 3 trang (MPA, khai báo trong vite.config.ts)
src/
  types.ts           # Product, ProductSummary, CartItem, ...
  dom.ts             # mustQuery<T>() — querySelector có kiểu, báo lỗi nếu thiếu phần tử
  data.ts            # gọi DummyJSON, HttpError / ProductNotFoundError
  cart.ts            # giỏ hàng trong localStorage + sự kiện "cart:change" có kiểu
  cart-ui.ts         # badge giỏ hàng, phản hồi "Đã thêm ✓"
  product-utils.ts   # filterByKeyword / sortByPrice (generic)
  render.ts          # HTML card sản phẩm, escapeHtml, formatPrice
  detail-render.ts   # HTML trang chi tiết
  pages/             # điểm vào từng trang: home.ts, product.ts, cart.ts
  styles/            # CSS giữ nguyên từ v2
```

## Khác biệt chính so với v2-js

- Dữ liệu API và giỏ hàng có kiểu rõ ràng (`src/types.ts`); dữ liệu từ `localStorage` được coi là `unknown` và kiểm tra trước khi dùng.
- Lỗi HTTP dùng class `HttpError` có `status`, thay cho việc gắn thêm thuộc tính vào `Error`.
- Sự kiện `cart:change` được khai báo trong `WindowEventMap` nên `addEventListener` biết kiểu `detail`.
- Timer của nút "Thêm vào giỏ" lưu trong `WeakMap` thay vì gắn thuộc tính lạ lên phần tử DOM.
