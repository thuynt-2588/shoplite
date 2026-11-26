import SearchBar from './SearchBar'

interface HeaderProps {
  cartCount: number
  categories: string[]
  selectedCategory: string
  searchQuery: string
  onCategoryChange: (category: string) => void
  onSearchChange: (value: string) => void
}

function Header({
  cartCount,
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e9e7e1] bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-7 gap-y-2 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-7">
        <div className="flex min-w-0 items-center gap-5">
          <a
            href="#top"
            aria-label="MÙA - Trang chủ"
            className="shrink-0 text-[26px] font-extrabold tracking-[-0.03em] text-[#15151b]"
          >
            MÙA<span className="ml-0.5 text-[#ff4438]">.</span>
          </a>
          <nav aria-label="Điều hướng chính" className="hidden min-w-0 xl:block">
            <ul className="flex items-center gap-1">
              <li>
                <button
                  type="button"
                  aria-pressed={selectedCategory === 'all'}
                  onClick={() => onCategoryChange('all')}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    selectedCategory === 'all'
                      ? 'bg-[#efece4] text-[#15151b]'
                      : 'text-[#45454f] hover:bg-[#f7f5f0] hover:text-[#15151b]'
                  }`}
                >
                  Cửa hàng
                </button>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    aria-pressed={selectedCategory === category}
                    onClick={() => onCategoryChange(category)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-[#efece4] text-[#15151b]'
                        : 'text-[#45454f] hover:bg-[#f7f5f0] hover:text-[#15151b]'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
            className="relative grid size-11 place-items-center rounded-full text-[#15151b] transition hover:bg-[#efece4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ff4438] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <nav
          aria-label="Danh mục sản phẩm"
          className="order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto sm:-mx-6 sm:w-[calc(100%+3rem)] xl:hidden"
        >
          <ul className="flex w-max items-center gap-1 px-4 pb-0.5 sm:px-6">
            <li>
              <button
                type="button"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => onCategoryChange('all')}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-[#15151b] text-white'
                    : 'text-[#45454f] hover:bg-[#efece4]'
                }`}
              >
                Cửa hàng
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  aria-pressed={selectedCategory === category}
                  onClick={() => onCategoryChange(category)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
                    selectedCategory === category
                      ? 'bg-[#15151b] text-white'
                      : 'text-[#45454f] hover:bg-[#efece4]'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
