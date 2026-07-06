import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/lib/api/axios";

export default function AdminProtectedLayout() {
  const navigate = useNavigate();

  const {
    data: meResponse,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["currentUserRoleCheck"],
    queryFn: async () => {
      const res = await api.get("/api/me");
      return res.data;
    },
    retry: false,
  });

  // 🎯 PERBAIKAN: Arahkan ke .data.profile.role sesuai log API Anda
  const userRole = meResponse?.data?.profile?.role;

  useEffect(() => {
    // Jalankan redirect HANYA jika loading selesai, data sudah sukses diambil, dan terbukti bukan ADMIN
    if (!isLoading && isFetched && userRole !== "ADMIN") {
      console.warn(`⛔ Akses ditolak! Role Anda adalah: ${userRole}`);
      navigate("/", { replace: true });
    }
  }, [userRole, isLoading, isFetched, navigate]);

  if (isLoading) {
    return (
      <div className="py-20 text-center font-bold">Checking credentials...</div>
    );
  }

  // Jika data belum siap atau role bukan ADMIN, jangan render komponen di dalamnya dulu
  if (!isFetched || userRole !== "ADMIN") {
    return null;
  }

  return <Outlet />;
}
