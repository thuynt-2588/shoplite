import { useMemo, useState } from 'react'
import ContactForm from './components/ContactForm'
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import ProductList from './components/ProductList'
import { useProducts } from './hooks/useProducts'
import type { CartItem, ProductSummary } from './types'

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao' },
]

const EMPTY_PRODUCTS: ProductSummary[] = []
const PRODUCTS_PER_BATCH = 8

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOption, setSortOption] = useState<SortOption>('popular')
  const [visibleProductCount, setVisibleProductCount] = useState(PRODUCTS_PER_BATCH)
  // Temporary client state; product data is server state managed by useProducts.
  const [cart, setCart] = useState<CartItem[]>([])
  const {
    data: fetchedProducts,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts()
  const products = fetchedProducts ?? EMPTY_PRODUCTS

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  )
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    const visibleProducts = products.filter((product) => {
      const matchesQuery =
        !query ||
        `${product.title} ${product.category}`.toLocaleLowerCase().includes(query)
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory

      return matchesQuery && matchesCategory
    })

    switch (sortOption) {
      case 'newest':
        return [...visibleProducts].sort((a, b) => b.id - a.id)
      case 'price-asc':
        return [...visibleProducts].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...visibleProducts].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...visibleProducts].sort((a, b) => b.rating - a.rating)
      default:
        return visibleProducts
    }
  }, [products, searchQuery, selectedCategory, sortOption])
  const visibleProducts = filteredProducts.slice(0, visibleProductCount)
  const remainingProductCount = filteredProducts.length - visibleProducts.length

  const resetVisibleProducts = () => {
    setVisibleProductCount(PRODUCTS_PER_BATCH)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    resetVisibleProducts()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    resetVisibleProducts()
  }

  const addToCart = (product: ProductSummary) => {
    setCart((currentCart) => {
      const existingItem = currentCart.some((item) => item.id === product.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity: 1,
        },
      ]
    })
  }

  return (
    <div id="top" className="min-h-screen bg-[#f7f5f0] text-[#15151b]">
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-4 pt-6 sm:px-6 sm:pt-8 lg:px-7">
        <section
          aria-label="Bộ sưu tập hè 2026"
          className="relative isolate mb-8 flex min-h-[340px] overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#15151b_0%,#2a2a33_55%,#ff4438_220%)] sm:mb-10"
        >
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 -bottom-10 -z-10 w-[46%] bg-[radial-gradient(circle_at_60%_40%,#ff4438,transparent_62%)] opacity-90 blur-lg sm:w-[55%]"
          />
          <div className="max-w-[620px] px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-white/70">
              <span className="size-1.5 rounded-full bg-[#ff4438]" />
              Bộ sưu tập hè 2026
            </div>
            <h1 className="text-[clamp(32px,6vw,56px)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
              Phong cách của
              <br />
              bạn, theo từng
              <br />
              mùa.
            </h1>
            <p className="mt-4 max-w-[440px] text-[15px] leading-7 text-white/70 sm:text-[17px]">
              Những thiết kế tối giản, chất liệu thoáng nhẹ và bền bỉ — sẵn sàng
              cho mọi khoảnh khắc trong ngày.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#products-catalog"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff4438] px-6 text-sm font-semibold text-white transition hover:bg-[#e8352a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Mua ngay <span aria-hidden="true" className="ml-1.5">→</span>
              </a>
              <a
                href="#products-catalog"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Xem hàng mới
              </a>
            </div>
          </div>
        </section>

        <div
          id="products-catalog"
          className="grid grid-cols-1 items-start gap-6 pb-8 xl:grid-cols-[248px_minmax(0,1fr)] xl:gap-8"
        >
          <aside aria-label="Danh mục và bộ lọc" className="flex flex-col gap-6">
            <section>
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#6f6f79]">
                Danh mục
              </h2>
              <ul className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible">
                <li className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={selectedCategory === 'all'}
                    onClick={() => handleCategoryChange('all')}
                    className={`flex w-full items-center justify-between gap-5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition xl:border-transparent ${
                      selectedCategory === 'all'
                        ? 'border-[#15151b] bg-[#15151b] text-white xl:bg-[#15151b]'
                        : 'border-[#e9e7e1] bg-white text-[#45454f] hover:bg-[#efece4] xl:bg-transparent'
                    }`}
                  >
                    <span>Tất cả</span>
                    <span
                      className={`text-xs font-bold ${
                        selectedCategory === 'all' ? 'text-white/65' : 'text-[#6f6f79]'
                      }`}
                    >
                      {products.length}
                    </span>
                  </button>
                </li>
                {categories.map((category) => {
                  const count = products.filter((product) => product.category === category).length
                  const active = selectedCategory === category

                  return (
                    <li key={category} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => handleCategoryChange(category)}
                        className={`flex w-full items-center justify-between gap-5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition xl:border-transparent ${
                          active
                            ? 'border-[#15151b] bg-[#15151b] text-white'
                            : 'border-[#e9e7e1] bg-white text-[#45454f] hover:bg-[#efece4] xl:bg-transparent'
                        }`}
                      >
                        <span>{category}</span>
                        <span className={active ? 'text-white/65' : 'text-[#6f6f79]'}>
                          {count}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="hidden sm:block">
              <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#6f6f79]">
                Ưu đãi
              </h2>
              <ul className="flex flex-wrap gap-3 xl:flex-col">
                <li className="flex items-center gap-2 text-sm font-medium text-[#45454f]">
                  <span className="rounded-full bg-[#ff4438] px-2.5 py-1 text-[11px] font-extrabold tracking-[0.04em] text-white">
                    SALE
                  </span>
                  Đang giảm giá
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold text-[#45454f]">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <path d="M16 8h4l3 3v5h-7z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Freeship từ 999.000đ
                </li>
              </ul>
            </section>
          </aside>

          <section aria-label="Danh sách sản phẩm" className="min-w-0">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="text-sm text-[#45454f]">
                <strong className="text-[#15151b]">
                  {isLoading ? '…' : isError ? '—' : filteredProducts.length}
                </strong>{' '}
                sản phẩm
              </p>
              <label className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-[#e9e7e1] bg-white px-3.5 text-[#15151b] transition hover:border-[#d9d6cd] focus-within:border-[#ff4438] focus-within:ring-4 focus-within:ring-[#ffe9e6]">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16M7 12h10m-7 6h4" />
                </svg>
                <select
                  aria-label="Sắp xếp sản phẩm"
                  value={sortOption}
                  onChange={(event) => {
                    const selectedOption = sortOptions.find(
                      (option) => option.value === event.target.value,
                    )
                    if (selectedOption) {
                      setSortOption(selectedOption.value)
                      resetVisibleProducts()
                    }
                  }}
                  className="cursor-pointer bg-transparent text-sm outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </header>
            {isLoading ? (
              <div
                role="status"
                aria-label="Đang tải sản phẩm"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    aria-hidden="true"
                    className="animate-pulse rounded-[28px] bg-white p-3 pb-5 shadow-[0_2px_8px_rgba(21,21,27,0.06)]"
                  >
                    <div className="mb-4 aspect-[1/1.15] rounded-3xl bg-[#efece4]" />
                    <div className="mb-3 h-3 w-1/3 rounded bg-[#efece4]" />
                    <div className="mb-2 h-4 rounded bg-[#efece4]" />
                    <div className="mb-4 h-4 w-1/2 rounded bg-[#efece4]" />
                    <div className="h-11 rounded-full bg-[#efece4]" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                role="alert"
                className="rounded-2xl border border-dashed border-[#d9d6cd] bg-white px-6 py-10 text-center"
              >
                <p className="text-sm text-[#45454f]">{error.message}</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 rounded-full bg-[#15151b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                <ProductList products={visibleProducts} onAddToCart={addToCart} />
                {remainingProductCount > 0 && (
                  <div className="mt-7 flex justify-center sm:mt-9">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleProductCount((count) =>
                          Math.min(count + PRODUCTS_PER_BATCH, filteredProducts.length),
                        )
                      }
                      className="w-full rounded-full border-[1.5px] border-[#d9d6cd] px-7 py-3 text-base font-semibold text-[#15151b] transition hover:border-[#15151b] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438] sm:w-auto"
                    >
                      Tải thêm sản phẩm{' '}
                      <span className="text-[#9c9ba6]">({remainingProductCount})</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <section
        aria-label="Đăng nhập và liên hệ"
        className="mx-auto grid max-w-[1320px] gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-7"
      >
        <LoginForm />
        <ContactForm />
      </section>

      <footer className="bg-[#15151b] px-4 py-10 text-white/70 sm:px-6 sm:py-12 lg:px-7">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-9">
            <section aria-label="Giới thiệu thương hiệu" className="sm:col-span-2 lg:col-span-1">
              <a
                href="#top"
                className="mb-3 inline-flex text-[26px] font-extrabold tracking-[-0.03em] text-white"
              >
                MÙA<span className="ml-0.5 text-[#ff4438]">.</span>
              </a>
              <p className="mb-6 max-w-[290px] text-sm leading-relaxed">
                Thời trang theo mùa — tối giản, bền vững, may đo tỉ mỉ cho nhịp
                sống mỗi ngày.
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li>Instagram</li>
                <li>TikTok</li>
                <li>Facebook</li>
              </ul>
            </section>
            <nav aria-label="Cửa hàng">
              <h2 className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white">
                CỬA HÀNG
              </h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li><a href="#products-catalog" className="transition hover:text-white">Hàng mới về</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Bán chạy</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Sale</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Bộ sưu tập</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Quà tặng</a></li>
              </ul>
            </nav>
            <nav aria-label="Hỗ trợ">
              <h2 className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white">HỖ TRỢ</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li><a href="#products-catalog" className="transition hover:text-white">Hướng dẫn chọn size</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Chính sách đổi trả</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Vận chuyển</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Liên hệ</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">FAQ</a></li>
              </ul>
            </nav>
            <nav aria-label="Về MÙA">
              <h2 className="mb-4 text-[13px] font-bold tracking-[0.06em] text-white">VỀ MÙA</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li><a href="#top" className="transition hover:text-white">Câu chuyện</a></li>
                <li><a href="#top" className="transition hover:text-white">Bền vững</a></li>
                <li><a href="#products-catalog" className="transition hover:text-white">Cửa hàng</a></li>
                <li><a href="#top" className="transition hover:text-white">Tuyển dụng</a></li>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col gap-2 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 MÙA Studio. Bản prototype demo.</p>
            <p>Thiết kế tại Việt Nam</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
