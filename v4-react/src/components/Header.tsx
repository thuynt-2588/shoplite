interface HeaderProps {
  cartCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
}

function Header({ cartCount, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <a
          href="/"
          aria-label="ShopLite - Trang chủ"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">
            S
          </span>
          ShopLite
        </a>

        <label className="order-3 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 lg:order-none lg:mx-8 lg:max-w-xl">
          <svg
            aria-hidden="true"
            className="size-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
          className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Header
