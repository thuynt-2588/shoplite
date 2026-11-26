import { defineConfig } from "vite";

// Multi-page build
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        product: "product.html",
        cart: "cart.html",
      },
    },
  },
});
