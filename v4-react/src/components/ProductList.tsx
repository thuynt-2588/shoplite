import type { ProductSummary } from '../types'
import ProductCard from './ProductCard'

interface ProductListProps {
  products: ProductSummary[]
  onAddToCart: () => void
}

function ProductList({ products, onAddToCart }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

export default ProductList
