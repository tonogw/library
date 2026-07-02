import api from "~/lib/api/axios";

/**
 * Memeriksa apakah sebuah buku memiliki pinjaman aktif (outstanding loan) di database
// @param bookId ID buku yang akan diperiksa
 * @returns boolean true jika ada pinjaman aktif, false jika bersih
 */

// BOOK VALIDATION
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
        String(loan.bookId) === String(bookId) && loan.status !== "RETURNED" // Sesuaikan token status dari Swagger (misal: "ACTIVE", "BORROWED")
      );
      
      return hasOutstanding;
    } 
catch (error) {
        console.error("Failed to fetch loans verification:", error);
        // Jika API loans gagal diakses, kembalikan true demi keamanan data (defensive programming)
        return true;
    }
    
});
    
    // BOOK MAINTENANCE: DELETE
    // export async function deleteBookById(bookId: string || number):Promise<void>{
    //     await api.delete(`/api/books/${bookId}`);
    // }
    
