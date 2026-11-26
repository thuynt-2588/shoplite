import SearchBar from './SearchBar'

interface HeaderProps {
  cartCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
}

function Header({ cartCount, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e9e7e1] bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-x-8 lg:px-7">
        <a
          href="#top"
          aria-label="MÙA - Trang chủ"
          className="text-[26px] font-extrabold tracking-[-0.03em] text-[#15151b]"
        >
          MÙA<span className="ml-0.5 text-[#ff4438]">.</span>
        </a>

        <div className="order-last w-full lg:order-none lg:w-1/2">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <button
          type="button"
          aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
          className="relative ml-auto grid size-11 shrink-0 place-items-center rounded-full text-[#15151b] transition hover:bg-[#efece4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
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
    </header>
  )
}

export default Header
