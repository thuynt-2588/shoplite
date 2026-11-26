interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="order-3 relative w-full lg:order-none lg:ml-auto lg:max-w-[420px]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6f79]"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm sản phẩm..."
        aria-label="Tìm sản phẩm"
        autoComplete="off"
        className="h-11 w-full rounded-full border-[1.5px] border-[#e9e7e1] bg-[#f7f5f0] pl-12 pr-4 text-[15px] text-[#15151b] outline-none transition placeholder:text-[#6f6f79] hover:border-[#d9d6cd] focus:border-[#ff4438] focus:bg-white focus:ring-4 focus:ring-[#ffe9e6]"
      />
    </label>
  )
}

export default SearchBar
