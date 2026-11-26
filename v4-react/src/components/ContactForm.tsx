import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactSchema, type ContactFormValues } from '../schemas/contactSchema'

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  return (
    <form
      onSubmit={handleSubmit(() => setSubmitted(true))}
      onChange={() => setSubmitted(false)}
      noValidate
      className="rounded-[24px] border border-[#e9e7e1] bg-white p-6 shadow-[0_2px_8px_rgba(21,21,27,0.06)] sm:p-8"
    >
      <h2 className="text-2xl font-bold tracking-tight text-[#15151b]">Liên hệ</h2>
      <p className="mt-1 text-sm text-[#6f6f79]">
        Gửi câu hỏi hoặc góp ý cho MÙA.
      </p>

      <div className="mt-5">
        <label htmlFor="contact-name" className="text-sm font-semibold text-[#45454f]">
          Họ tên
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className="mt-1.5 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 text-sm text-[#15151b] outline-none transition focus:border-[#ff4438] focus:ring-4 focus:ring-[#ffe9e6]"
          {...register('name')}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 text-sm text-[#e8352a]" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="contact-email" className="text-sm font-semibold text-[#45454f]">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className="mt-1.5 w-full rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 text-sm text-[#15151b] outline-none transition focus:border-[#ff4438] focus:ring-4 focus:ring-[#ffe9e6]"
          {...register('email')}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 text-sm text-[#e8352a]" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="text-sm font-semibold text-[#45454f]">
          Nội dung
        </label>
        <textarea
          id="contact-message"
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className="mt-1.5 w-full resize-y rounded-xl border border-[#d9d6cd] bg-white px-3 py-2.5 text-sm text-[#15151b] outline-none transition focus:border-[#ff4438] focus:ring-4 focus:ring-[#ffe9e6]"
          {...register('message')}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-[#e8352a]" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#15151b] px-5 text-sm font-semibold text-white transition hover:bg-[#ff4438] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4438]"
      >
        Gửi liên hệ
      </button>
      {submitted && (
        <p role="status" className="mt-3 text-sm text-[#1c8a4b]">
          Thông tin hợp lệ. Form demo chưa kết nối dịch vụ gửi liên hệ.
        </p>
      )}
    </form>
  )
}

export default ContactForm
