import { useMemo, useState } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import { products } from './data'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()

    if (!query) return products

    return products.filter((product) =>
      `${product.title} ${product.category}`.toLocaleLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
            Chào mừng đến với ShopLite
          </p>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Món đồ yêu thích, giá thật dễ chịu.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Khám phá những sản phẩm được chọn lọc dành riêng cho bạn.
          </p>
        </section>

        <section aria-labelledby="products-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-indigo-600">Bộ sưu tập</p>
              <h2 id="products-heading" className="mt-1 text-2xl font-bold tracking-tight">
                Sản phẩm nổi bật
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {filteredProducts.length} sản phẩm
            </p>
          </div>
          <ProductList
            products={filteredProducts}
            onAddToCart={() => setCartCount((count) => count + 1)}
          />
        </section>
      </main>
    </div>
  )
}

export default App
