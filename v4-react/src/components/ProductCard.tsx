import type { ProductSummary } from '../types'

interface ProductCardProps {
  product: ProductSummary
  onAddToCart: () => void
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="size-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-indigo-600">{product.category}</p>
        <h3 className="mt-1 min-h-12 text-sm font-semibold leading-6 text-slate-900 sm:text-base">
          {product.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <span aria-hidden="true" className="text-amber-400">
            ★
          </span>
          <span className="font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-slate-400">/ 5</span>
        </div>

        <div className="mt-4 flex-1">
          <p className="text-base font-bold text-slate-900">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-slate-500">Còn {product.stock} sản phẩm</p>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg
            aria-hidden="true"
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
            <path d="M10 10v4m4-4v4" />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}

export default ProductCard
