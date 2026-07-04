import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router"; // Menggunakan React Router v7
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";

interface Book {
  id: string;
  title: string;
  authorName: string;
  previewUrl?: string;
  coverImage?: string;
  rating?: number;
}

export default function UserBooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. TANGKAP KEYWORD DARI URL YANG DIKIRIM NAVBAR
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const page = searchParams.get("page") || "1";

  // 2. TEMBAK API MENGGUNAKAN LOGIKA YANG SUDAH TERUJI
  const { data: booksData, isLoading: isBooksLoading } = useQuery({
    // Setiap kali `search` di URL berubah, TanStack Query otomatis mengambil data baru
    queryKey: ["userBooks", { search, categoryFilter, page }],
    queryFn: async () => {
      const response = await api.get("/api/books", {
        // Menggunakan endpoint publik/user
        params: {
          q: search || undefined, // Kata kunci dari navbar masuk ke sini
          category: categoryFilter || undefined,
          page,
          limit: 12,
        },
      });
      return response.data;
    },
  });

  // 3. AMBIL DATA DAFTAR KATEGORI UNTUK SIDEBAR FILTER
  const { data: categoriesData } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });

  const categories = categoriesData?.data?.categories || [];

  const cleanCategories = categories.filter(
    (cat: any) =>
      cat.name !== "string" && !cat.name.toLowerCase().includes("test"),
  );
  //   const categories = Array.isArray(categoriesData)
  //     ? categoriesData
  //     : categoriesData?.data || categoriesData?.categories || [];

  // Amankan data buku & kategori agar tidak memicu error ".map is not a function"
  const books: Book[] = booksData?.data?.books || booksData?.books || [];

  //   const categories = Array.isArray(categoriesData)
  //     ? categoriesData
  //     : categoriesData?.data || categoriesData?.categories || [];

  // Fungsi pembantu ketika checkbox kategori diklik
  const handleCategoryChange = (categoryId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryFilter === categoryId) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryId);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-90.25 bg-white px-4 py-8 font-quicksand lg:max-w-300">
        <h1 className="mb-8 text-[36px] leading-11 font-bold tracking-tight text-[#0A0D12]">
          Book List
        </h1>

        <div className="flex flex-col items-start gap-10 md:flex-row">
          {/* SIDEBAR FILTER (KIRI) */}
          <aside className="rounded-3 flex w-full shrink-0 flex-col gap-6 bg-white p-4 py-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:w-66.5">
            <div className="flex flex-col gap-3">
              <span className="text-[16px] font-bold tracking-wider text-[#0A0D12] uppercase opacity-50">
                FILTER
              </span>
              <h2 className="-mt-1 text-[18px] leading-8 font-bold text-[#0A0D12]">
                Category
              </h2>

              <div className="flex flex-col gap-2.5">
                {/* Jika API Kategori kosong/error, tampilkan mockup statis bawaan figma */}
                {cleanCategories.length === 0
                  ? [
                      "Fiction",
                      "Non-fiction",
                      "Self-Improve",
                      "Finance",
                      "Science",
                      "Education",
                    ].map((catName) => (
                      <label
                        key={catName}
                        className="flex h-7.5 cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={categoryFilter === catName.toLowerCase()}
                          onChange={() =>
                            handleCategoryChange(catName.toLowerCase())
                          }
                          className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] text-[#1C65DA] checked:bg-[#1C65DA] focus:ring-0"
                        />
                        <span className="text-[16px] leading-7.5 font-medium text-[#0A0D12]">
                          {catName}
                        </span>
                      </label>
                    ))
                  : // Jika API Kategori ada isinya, render dari data API
                    cleanCategories.map((cat: any) => (
                      <label
                        key={cat.id}
                        className="flex h-7.5 cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={categoryFilter === String(cat.id)}
                          onChange={() => handleCategoryChange(String(cat.id))}
                          className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] text-[#1C65DA] checked:bg-[#1C65DA] focus:ring-0"
                        />
                        <span className="text-[16px] leading-7.5 font-medium text-[#0A0D12]">
                          {cat.name}
                        </span>
                      </label>
                    ))}
              </div>
            </div>
          </aside>

          {/* GRID LIST BUKU (KANAN) */}
          <main className="w-full shrink-0 md:w-219.75">
            {isBooksLoading ? (
              <p className="py-10 text-center">Loading books...</p>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[18px] font-bold text-[#181D27]">
                  Buku tidak ditemukan
                </p>
                <p className="text-[14px] text-neutral-700">
                  Coba cari dengan judul atau nama penulis lain.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => {
                  const coverUrl =
                    book.previewUrl ||
                    book.coverImage ||
                    "/images/book-placeholder.png";
                  return (
                    <Link
                      to={`/books/${book.id}`}
                      key={book.id}
                      className="rounded-3 flex h-[439.12px] w-full max-w-[204.75px] flex-col overflow-hidden bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.01]"
                    >
                      <img
                        src={coverUrl}
                        alt={book.title}
                        className="rounded-t-3 h-[307.12px] w-full object-cover"
                      />
                      <div className="flex h-33 flex-col justify-start gap-1 bg-white p-4">
                        <h3 className="truncate text-[18px] leading-8 font-bold text-[#181D27]">
                          {book.title}
                        </h3>
                        <p className="-mt-1 truncate text-[16px] leading-7.5 font-medium text-neutral-700">
                          {book.authorName}
                        </p>
                        <div className="mt-auto flex items-center gap-1">
                          <svg
                            className="h-6 w-6 text-[#FFAB0D]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span className="text-[16px] leading-7.5 font-semibold text-[#181D27]">
                            {/* 4.9 */}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
