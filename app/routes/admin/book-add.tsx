import { useNavigate } from "react-router";
import { useState } from "react";
import { BookForm } from "~/components/shared/book-form"; // Sesuaikan path komponen form Anda
import { toast } from "sonner";
import api from "~/lib/api/axios";
import { categoriesBackend } from "~/constant/category-data";
import Navbar from "~/components/layout/navbar";

export default function AdminBookMaintenance() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  // Handler khusus untuk membuat (CREATE) buku baru ke backend Railway
  //   const handleCreateBook = async (formData: FormData) => {
  const handleCreateBook = async (formData: any) => {
    setIsPending(true);
    try {
      // Tembak endpoint POST ke backend Railway untuk menyimpan buku baru
      const response = await api.post("/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Wajib untuk handling upload coverImage
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Buku baru berhasil ditambahkan ke koleksi!");
        // Setelah sukses, langsung arahkan Admin kembali ke tabel daftar buku
        navigate("/admin/books");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Gagal menambahkan data buku baru.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-360 bg-red-300">
      <Navbar />
      <div className="mx-auto max-w-132.25 bg-amber-200 font-quicksand">
        <div className="mb-6">
          <h1 className="text-24 font-bold text-[#0A0D12]">Add New Book</h1>
          <p className="text-14 text-gray-500">
            Masukkan detail informasi fisik buku untuk ditambahkan ke sistem
            perpustakaan.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm">
          {/* Panggil BookForm tanpa initialData agar dia murni menjadi Form INPUT KOSONG */}
          <BookForm
            onSubmit={handleCreateBook}
            isPending={isPending}
            categories={categoriesBackend}
          />
        </div>
      </div>
    </div>
  );
}
