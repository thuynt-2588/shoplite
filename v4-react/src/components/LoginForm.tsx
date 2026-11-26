import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'

function LoginForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form
      onSubmit={handleSubmit(() => setSubmitted(true))}
      onChange={() => setSubmitted(false)}
      noValidate
      className="rounded-[24px] border border-[#e9e7e1] bg-white p-6 shadow-[0_2px_8px_rgba(21,21,27,0.06)] sm:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-[#15151b]">Đăng nhập</h2>
      <p className="mt-1 text-sm text-[#6f6f79]">
        Đăng nhập vào tài khoản MÙA của bạn.
      </p>

      <div className="mt-5">
        <label htmlFor="login-email" className="text-sm font-semibold text-[#45454f]">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className="mt-1.5 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 text-sm text-[#15151b] outline-none transition focus:border-[#ff4438] focus:ring-4 focus:ring-[#ffe9e6]"
          {...register('email')}
        />
        {errors.email && (
          <p id="login-email-error" className="mt-1 text-sm text-[#e8352a]" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="login-password" className="text-sm font-semibold text-[#45454f]">
          Mật khẩu
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className="mt-1.5 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 text-sm text-[#15151b] outline-none transition focus:border-[#ff4438] focus:ring-4 focus:ring-[#ffe9e6]"
          {...register('password')}
        />
        {errors.password && (
          <p id="login-password-error" className="mt-1 text-sm text-[#e8352a]" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#15151b] px-5 text-sm font-semibold text-white transition hover:bg-[#ff4438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
      >
        Đăng nhập
      </button>
      {submitted && (
        <p role="status" className="mt-3 text-sm text-[#1c8a4b]">
          Thông tin hợp lệ. Form demo chưa kết nối dịch vụ đăng nhập.
        </p>
      )}
    </form>
  )
}

export default LoginForm
