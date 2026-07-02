import api from "~/lib/api/axios";

/**
 * Memeriksa apakah sebuah buku memiliki pinjaman aktif (outstanding loan) di database
 * @param bookId ID buku yang akan diperiksa
 * @returns boolean true jika ada pinjaman aktif, false jika bersih
 */
export async function checkOutstandingLoan(
  bookId: string | number,
): Promise<boolean> {
  try {
    // 1. Ambil data transaksi pinjaman global dari Swagger endpoint
    const response = await api.get("/api/loans");
    const allLoans = response.data || [];

    // 2. Filter menggunakan logika pencocokan ID dan status pinjaman aktif
    const hasOutstanding = allLoans.some((loan: any) => {
      return (
        String(loan.bookId) === String(bookId) && loan.status !== "RETURNED"
      );
    });

    // Kembalikan nilai hasil pengecekan interseptor
    return hasOutstanding;
  } catch (error) {
    console.error("Failed to fetch loans verification:", error);
    // Jika API loans gagal diakses, kembalikan true demi keamanan data (defensive programming)
    return true;
  }
}

/**
 * Mengeksekusi penghapusan data buku ke backend Railway
 * @param bookId ID buku yang akan dihapus
 */
export async function deleteBookById(bookId: string | number): Promise<void> {
  await api.delete(`/api/books/${bookId}`);
}
