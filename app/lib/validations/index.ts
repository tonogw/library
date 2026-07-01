import { z } from "zod"

// 1. Skema Registrasi (Sesuai dengan Figma "Screenshot 2026-06-30 at 11.15.30.png")
export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama harus minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    phone: z.string().min(10, "Nomor handphone minimal 10 digit"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })

// 2. Skema Login
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})

// 3. Skema Update Profil (Menampung alamat & opsi file foto avatar)
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  phone: z.string().min(10, "Nomor handphone minimal 10 digit"),
  address: z.string().optional(),
  profilePhoto: z.any().optional(), // Untuk menampung file upload data
})

// 4. Skema Checkout / Pinjam Buku (Sesuai spec Cart & Loans)
export const checkoutSchema = z.object({
  loanDurationDays: z
    .number()
    .min(1, "Durasi peminjaman minimal 1 hari")
    .max(14, "Maksimal peminjaman 14 hari"),
  notes: z.string().optional(),
})

// Export Type untuk React Hook Form
export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
export type CheckoutFormValues = z.infer<typeof checkoutSchema>
