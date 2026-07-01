import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from "zod"
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import api from '~/lib/api/axios';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormValues } from '~/lib/validations';

// Skema Validasi Zod disesuaikan dengan form Figma
// const registerSchema = z
//   .object({
//     name: z.string().min(2, "Nama harus minimal 2 karakter"),
//     email: z.string().email("Format email tidak valid"),
//     phone: z.string().min(10, "Nomor handphone minimal 10 digit"),
//     password: z.string().min(6, "Password minimal 6 karakter"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Konfirmasi password tidak cocok",
//     path: ["confirmPassword"],
//   })

// type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  // Integrasi TanStack Query Mutation untuk hit API Railway
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await api.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan login.');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Gagal melakukan registrasi';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white font-['Quicksand']">
      <div className="flex w-[400px] flex-col gap-5 py-[94px]">
        {/* Logo & Brand */}
        <div className="flex flex-row items-center gap-[11.79px]">
          <img src="./icons/Logo.svg" alt="logo" />

          {/* <div className="relative flex h-33 w-33 items-center justify-center rounded bg-[#1C65DA]"> */}
          {/* Simbol Logo Grid Segi Delapan Mini */}
          {/* <span className="text-lg font-bold text-white">B</span> */}
          {/* </div> */}
          <span className="text-[25.14px] leading-33 font-bold text-[#0A0D12]">
            Booky
          </span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-28 font-bold tracking-tight text-[#0A0D12]">
            Register
          </h1>
          <p className="text-16 font-semibold tracking-tight text-[#414651]">
            Create your account to start borrowing books.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Input Name */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">Name</label>
            <Input
              {...register('name')}
              type="text"
              placeholder="Masukkan nama lengkap"
              className={`rounded-12 h-12 border px-4 ${
                errors.name
                  ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                  : 'border-gray-200'
              }`}
            />
            {errors.name && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Input Email */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">Email</label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Masukkan email aktif"
              className={`rounded-12 h-12 border px-4 ${
                errors.email
                  ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                  : 'border-gray-200'
              }`}
            />
            {errors.email && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Input Nomor Handphone */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">
              Nomor Handphone
            </label>
            <Input
              {...register('phone')}
              type="tel"
              placeholder="Contoh: 08123456789"
              className={`rounded-12 h-12 border px-4 ${
                errors.phone
                  ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                  : 'border-gray-200'
              }`}
            />
            {errors.phone && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">Password</label>
            <div className="relative">
              <Input
                {...register('password')}
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Input new password"
                autoComplete="new-password"
                className={`rounded-12 h-12 border pr-12 pl-4 ${
                  errors.password
                    ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                    : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Input Confirm Password */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                autoComplete="confirm-new-password"

                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                className={`rounded-12 h-12 border pr-12 pl-4 ${
                  errors.confirmPassword
                    ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                    : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="text-16 mt-2 h-12 w-full rounded-full bg-[#1C65DA] font-bold text-[#FDFDFD] hover:bg-[#154eb3]"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>

        {/* Redirect Link */}
        <div className="text-16 flex flex-row justify-center gap-1 font-semibold text-[#0A0D12]">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="font-bold text-[#1C65DA] hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
