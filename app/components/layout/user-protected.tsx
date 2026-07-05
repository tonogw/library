import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/lib/api/axios";

export default function UserProtectedLayout() {
  // Ambil data profil realtime untuk memeriksa status login
  const { data: meResponse, isLoading } = useQuery({
    queryKey: ["currentUserRoleCheckUserSide"],
    queryFn: async () => {
      const res = await api.get("/api/me");
      return res.data;
    },
    retry: false, // Jika tidak ada token (guest), langsung stop
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center font-['Quicksand'] font-bold text-gray-400">
        Verifying user access...
      </div>
    );
  }

  const userRole = meResponse?.data?.role; // Menghasilkan "USER" atau "ADMIN"

  // 💥 KUNCI RESTRIKSI MEMBER:
  // Jika tidak punya akun (Guest), tendang paksa ke halaman /login agar mereka masuk dulu
  if (!userRole) {
    console.warn("⛔ Akses ditolak! Halaman ini khusus member terdaftar.");
    return <Navigate to="/login" replace />;
  }

  // Jika dia adalah USER (atau ADMIN yang sedang dibolehkan lewat), silakan masuk ke halaman transaksi
  return <Outlet />;
}
