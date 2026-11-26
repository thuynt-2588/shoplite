import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  password: z.string().min(8, 'Mật khẩu cần có ít nhất 8 ký tự'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
