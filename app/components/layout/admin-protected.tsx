import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/lib/api/axios";

export default function AdminProtectedLayout() {
  // Ambil data user login secara realtime dari middleware server backend
  const { data: meResponse, isLoading } = useQuery({
    queryKey: ["currentUserRoleCheck"],
    queryFn: async () => {
      const res = await api.get("/api/me");
      return res.data;
    },
    retry: false, // Jika token invalid/expired, langsung hentikan percobaan
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center font-bold">Checking credentials...</div>
    );
  }

  const userRole = meResponse?.data?.role; // Menangkap string "ADMIN" atau "USER"

  // 💥 KUNCI RESTRIKSI: Jika bukan ADMIN, tendang paksa balik ke halaman utama secara otomatis!
  if (userRole !== "ADMIN") {
    console.warn("⛔ Akses ditolak! Anda bukan admin.");
    return <Navigate to="/" replace />;
  }

  // Jika terbukti ADMIN, persilahkan masuk ke halaman dashboard admin figma
  return <Outlet />;
}
