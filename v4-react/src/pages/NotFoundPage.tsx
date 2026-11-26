import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5f0] px-4 text-center text-[#15151b]">
      <div>
        <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#ff4438]">
          Quay lại cửa hàng
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
