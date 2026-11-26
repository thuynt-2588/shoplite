import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Họ tên cần có ít nhất 2 ký tự'),
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  message: z.string().trim().min(10, 'Nội dung cần có ít nhất 10 ký tự'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
