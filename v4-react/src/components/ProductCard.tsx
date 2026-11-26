import type { ProductSummary } from '../types'

interface ProductCardProps {
  product: ProductSummary
  onAddToCart: (product: ProductSummary) => void
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)

const thumbnailTones = ['bg-[#d6cab8]', 'bg-[#be9e72]', 'bg-[#2e3038]']

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const oldPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null

  return (
    <article className="group relative flex h-full flex-col rounded-[28px] bg-white p-3 pb-5 shadow-[0_2px_8px_rgba(21,21,27,0.06)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(21,21,27,0.1)] focus-within:-translate-y-[3px] focus-within:shadow-[0_8px_24px_rgba(21,21,27,0.1)]">
      <div
        className={`relative mb-4 aspect-[1/1.15] overflow-hidden rounded-3xl ${thumbnailTones[product.id % thumbnailTones.length]}`}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ff4438] px-2.5 py-1 text-xs font-bold leading-tight text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6f6f79]">
          {product.category}
        </p>
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold leading-[1.35] tracking-[-0.02em] text-[#15151b] transition-colors group-hover:text-[#ff4438]">
          {product.title}
        </h3>

        <div className="mb-2.5 flex items-center gap-1 text-[13px]">
          <span aria-hidden="true" className="text-[15px] leading-none tracking-[-1px] text-[#ff4438]">
            {'★'.repeat(Math.max(0, Math.min(5, Math.round(product.rating))))}
            {'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(product.rating))))}
          </span>
          <span className="font-bold text-[#45454f]">{product.rating.toFixed(1)}</span>
        </div>

        <div className="mb-4 flex flex-wrap items-baseline gap-x-2">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#15151b]">
            {formatPrice(product.price)}
          </p>
          {oldPrice !== null && (
            <p className="text-sm text-[#6f6f79] line-through">{formatPrice(oldPrice)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="relative z-[2] mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#15151b] px-3 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-[#ff4438] hover:shadow-[0_8px_22px_rgba(255,68,56,0.35)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
        >
          <svg
            aria-hidden="true"
            className="size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.6 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6" />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}

export default ProductCard
