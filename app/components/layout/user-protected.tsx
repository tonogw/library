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
    retry: false,
    staleTime: 5000, // Menjaga cache data login selama 5 detik agar tidak flash menendang user
  });

  // Back-up check: Jika di localStorage masih ada token/sesi, jangan lempar dulu saat loading
  const hasLocalToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  if (isLoading) {
    if (hasLocalToken) return <Outlet />; // Biarkan tetap render jika token lokal terdeteksi aman
    return (
      <div className="py-20 text-center font-['Quicksand'] font-bold text-gray-400">
        Verifying user access...
      </div>
    );
  }

  const userRole = meResponse?.data?.role;

  // KUNCIL RESTRIKSI: Jika server menyatakan tidak login DAN tidak ada token lokal
  if (!userRole && !hasLocalToken) {
    console.warn("⛔ Akses ditolak! Silakan login terlebih dahulu.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
