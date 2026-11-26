import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

function ProductDetailPage() {
  const { id: productId } = useParams()
  const id = Number(productId)
  const isValidId =
    productId !== undefined && /^\d+$/.test(productId) && Number.isSafeInteger(id) && id > 0
  const { data: product, isLoading, isError, error, refetch } = useProduct(isValidId ? id : 0)

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#15151b]">
      <header className="border-b border-[#e9e7e1] bg-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-4 sm:px-6 lg:px-7">
          <Link
            to="/"
            aria-label="MÙA - Trang chủ"
            className="text-[26px] font-extrabold tracking-[-0.03em] text-[#15151b]"
          >
            MÙA<span className="ml-0.5 text-[#ff4438]">.</span>
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-[#45454f] transition hover:text-[#ff4438]"
          >
            ← Quay lại cửa hàng
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-12 lg:px-7">
        {!isValidId ? (
          <p role="alert" className="rounded-2xl bg-white p-8 text-center text-[#45454f]">
            Mã sản phẩm không hợp lệ.
          </p>
        ) : isLoading ? (
          <div
            role="status"
            aria-label="Đang tải chi tiết sản phẩm"
            className="grid animate-pulse gap-8 lg:grid-cols-2"
          >
            <div className="aspect-square rounded-[24px] bg-[#efece4]" />
            <div className="space-y-5 py-4">
              <div className="h-4 w-1/4 rounded bg-[#efece4]" />
              <div className="h-10 rounded bg-[#efece4]" />
              <div className="h-6 w-1/3 rounded bg-[#efece4]" />
              <div className="h-24 rounded bg-[#efece4]" />
            </div>
          </div>
        ) : isError ? (
          <div role="alert" className="rounded-2xl bg-white p-8 text-center">
            <p className="text-[#45454f]">{error.message}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-full bg-[#15151b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
            >
              Thử lại
            </button>
          </div>
        ) : product ? (
          <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-[24px] bg-white p-3 shadow-[0_2px_8px_rgba(21,21,27,0.06)]">
              <img
                src={product.images[0] ?? product.thumbnail}
                alt={product.title}
                className="aspect-square w-full rounded-[18px] object-cover"
              />
            </div>

            <div className="py-2">
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#6f6f79]">
                {product.category}
                {product.brand && ` · ${product.brand}`}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
                {product.title}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span aria-hidden="true" className="tracking-[-1px] text-[#ff4438]">
                  {'★'.repeat(Math.max(0, Math.min(5, Math.round(product.rating))))}
                  {'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(product.rating))))}
                </span>
                <span className="font-semibold text-[#45454f]">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <p className="text-2xl font-bold">
                  {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                </p>
                {product.discountPercentage > 0 && (
                  <>
                    <p className="text-base text-[#6f6f79] line-through">
                      {formatPrice(product.price)}
                    </p>
                    <span className="rounded-full bg-[#ff4438] px-2.5 py-1 text-xs font-bold text-white">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-6 leading-7 text-[#45454f]">{product.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 text-sm">
                <div>
                  <dt className="text-[#6f6f79]">Tình trạng kho</dt>
                  <dd className="mt-1 font-semibold">{product.stock} sản phẩm</dd>
                </div>
                {product.sku && (
                  <div>
                    <dt className="text-[#6f6f79]">SKU</dt>
                    <dd className="mt-1 font-semibold">{product.sku}</dd>
                  </div>
                )}
              </dl>

              <Link
                to="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#15151b] px-6 text-sm font-semibold text-white transition hover:bg-[#ff4438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  )
}

export default ProductDetailPage
