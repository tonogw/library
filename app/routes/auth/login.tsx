import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { InputGroup, InputGroupAddon } from '~/components/ui/input-group';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setCredentials } from '~/store/authSlice';
import api from '~/lib/api/axios';
import { toast } from 'sonner';
import { loginSchema } from '~/lib/validations';
import type { LoginFormValues } from '~/lib/validations';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Mutasi TanStack Query untuk Hit Login API
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    },
    onSuccess: (resData) => {
      // 1. Simpan token & user ke Redux + LocalStorage
      dispatch(
        setCredentials({
          user: resData.data.user,
          token: resData.data.token,
        }),
      );

      toast.success('Login berhasil! Selamat datang kembali.');

      // 2. SOPHISTICATED REDIRECT: Cek role user hasil login
      if (resData.data.user?.role === 'ADMIN') {
        navigate('/admin/users'); // Arahkan ke dashboard list admin
      } else {
        navigate('/'); // User biasa arahkan ke home
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Email atau password salah';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white font-['Quicksand']">
      <div className="flex w-[400px] flex-col gap-5 py-[94px]">
        {/* Logo & Brand */}
        <div className="flex flex-row items-center gap-[11.79px]">
          <img
            src="/icons/Logo.svg"
            alt="logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-[25.14px] leading-33 font-bold text-[#0A0D12]">
            Booky
          </span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-28 font-bold tracking-tight text-[#0A0D12]">
            Login
          </h1>
          <p className="text-16 font-semibold tracking-tight text-[#414651]">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Input Email */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">Email</label>
            <Input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="Masukkan email Anda"
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

          {/* Input Password */}
          <div className="flex flex-col gap-0.5">
            <label className="text-14 font-bold text-[#0A0D12]">Password</label>

            {/* INTEGRASI INPUT GROUP BERSAMA REGISTER */}
            <InputGroup className="relative">
              <Input
                {...register('password')}
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Masukkan password Anda"
                className={`rounded-12 h-12 w-full border pr-12 pl-4 ${
                  errors.password
                    ? 'border-[#EE1D52] focus-visible:ring-[#EE1D52]'
                    : 'border-gray-200'
                }`}
              />
              <InputGroupAddon
                align="inline-end"
                className="absolute top-1/2 right-4 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex cursor-pointer items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <img
                    src={showPassword ? '/icons/eye.svg' : '/icons/eye-off.svg'}
                    alt="toggle visibility"
                    className="h-5 w-5 object-contain"
                  />
                </button>
              </InputGroupAddon>
            </InputGroup>

            {errors.password && (
              <span className="text-14 font-medium tracking-tight text-[#EE1D52]">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="text-16 mt-2 h-12 w-full cursor-pointer rounded-full bg-[#1C65DA] font-bold text-[#FDFDFD] hover:bg-[#154eb3]"
          >
            {isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        {/* Redirect Link */}
        <div className="text-16 flex flex-row justify-center gap-1 font-semibold text-[#0A0D12]">
          <span>Don't have an account?</span>
          <Link
            to="/register"
            className="font-bold text-[#1C65DA] hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
