import type { ProductSummary } from '../types'
import ProductCard from './ProductCard'

interface ProductListProps {
  products: ProductSummary[]
  onAddToCart: (product: ProductSummary) => void
}

function ProductList({ products, onAddToCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="col-span-full rounded-2xl border border-dashed border-[#d9d6cd] bg-white px-6 py-12 text-center text-sm text-[#45454f]">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    )
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

export default ProductList
