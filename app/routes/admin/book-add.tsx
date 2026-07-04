import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BookForm } from "~/components/shared/book-form";
import { toast } from "sonner";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { useState } from "react";

export default function AdminBookMaintenance() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  // Ambil data kategori asli langsung dari server Railway agar ID Kategori sinkron 100%
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data?.data?.categories || res.data?.data || res.data || [];
    },
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Handler utama untuk mengirimkan data buku baru ke backend Railway
  const handleCreateBook = async (formDataPayload: any) => {
    setIsPending(true);

    // Cek apakah payload berupa FormData (mengandung gambar) atau JSON murni
    const isFormData = formDataPayload instanceof FormData;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // Pastikan konfigurasi header dinamis membaca tipe kiriman data
    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
        ...(token ? { Authentication: `Bearer ${token}` } : {}),
      },
      timeout: 600,
    };

    try {
      // Kirim objek payload murni langsung ke backend Railway
      const response = await api.post("/api/books", formDataPayload, config);

      if (response.status === 200 || response.status === 201) {
        toast.success("Buku baru berhasil ditambahkan ke koleksi!");
        navigate("/admin/books");
      }
    } catch (error: any) {
      // Tampilkan pesan eror spesifik dari server jika ada data tidak valid
      toast.error(
        error.response?.data?.message || "Gagal menambahkan data buku baru.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-quicksand">
      <Navbar />
      <main className="mx-auto flex max-w-[529px] flex-col gap-6 px-4 py-6 md:px-0">
        <div className="mb-2">
          <h1 className="text-24 font-bold text-[#0A0D12]">Add New Book</h1>
          <p className="text-14 text-gray-500">
            Masukkan detail informasi fisik buku untuk ditambahkan ke sistem
            perpustakaan.
          </p>
        </div>

        <div className="w-full">
          {/* Panggil BookForm dengan menyuplai data kategori dinamis dari database */}
          <BookForm
            onSubmit={handleCreateBook}
            isPending={isPending}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
}
