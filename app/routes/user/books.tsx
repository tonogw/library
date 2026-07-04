import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router"; // React Router v7
import api from "~/lib/api/axios";

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

  // State filter yang disinkronkan langsung dengan URLSearchParams
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const ratingFilter = searchParams.get("rating") || "";
  const page = searchParams.get("page") || "1";

  // Fetch data buku menggunakan TanStack Query
  const { data: booksData, isLoading: isBooksLoading } = useQuery({
    queryKey: ["userBooks", { search, categoryFilter, ratingFilter, page }],
    queryFn: async () => {
      const res = await api.get("/api/books", {
        params: {
          q: search || undefined,
          category: categoryFilter || undefined,
          rating: ratingFilter || undefined,
          page,
          limit: 12,
        },
      });
      return res.data;
    },
  });

  // Fetch daftar kategori untuk mengisi sidebar filter
  const { data: categoriesData } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });

  const books: Book[] = booksData?.data?.books || booksData?.books || [];
  const categories = categoriesData?.data || [];

  // Handler memperbarui state filter di URL
  const handleCategoryChange = (categoryId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryFilter === categoryId) {
      nextParams.delete("category"); // Toggle off jika diklik ulang
    } else {
      nextParams.set("category", categoryId);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handleRatingChange = (rating: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (ratingFilter === rating) {
      nextParams.delete("rating");
    } else {
      nextParams.set("rating", rating);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white px-4 py-8 font-quicksand">
      {/* Title Header: Book List */}
      <h1 className="mb-8 text-[36px] leading-[44px] font-bold tracking-tight text-[#0A0D12]">
        Book List
      </h1>

      {/* Main Content Layout Container */}
      <div className="flex flex-col items-start gap-10 md:flex-row">
        {/* ================= LEFT SIDEBAR: FILTER ================= */}
        <aside className="flex w-full flex-shrink-0 flex-col gap-6 rounded-[12px] bg-white p-4 py-[16px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:w-[266px]">
          {/* Section: Category */}
          <div className="flex flex-col gap-3">
            <span className="text-[16px] font-bold tracking-wider text-[#0A0D12] uppercase opacity-50">
              FILTER
            </span>
            <h2 className="-mt-1 text-[18px] leading-[32px] font-bold text-[#0A0D12]">
              Category
            </h2>

            <div className="flex flex-col gap-[10px]">
              {/* Fallback mockup static dari Figma jika API kategori kosong */}
              {categories.length === 0
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
                      className="flex h-[30px] cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={categoryFilter === catName.toLowerCase()}
                        onChange={() =>
                          handleCategoryChange(catName.toLowerCase())
                        }
                        className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] text-[#1C65DA] checked:border-transparent checked:bg-[#1C65DA] focus:ring-0"
                      />
                      <span className="text-[16px] leading-[30px] font-medium text-[#0A0D12]">
                        {catName}
                      </span>
                    </label>
                  ))
                : categories.map((cat: any) => (
                    <label
                      key={cat.id}
                      className="flex h-[30px] cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={categoryFilter === String(cat.id)}
                        onChange={() => handleCategoryChange(String(cat.id))}
                        className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] text-[#1C65DA] checked:bg-[#1C65DA] focus:ring-0"
                      />
                      <span className="text-[16px] leading-[30px] font-medium text-[#0A0D12]">
                        {cat.name}
                      </span>
                    </label>
                  ))}
            </div>
          </div>

          {/* Divider Line 6 */}
          <hr className="border-[#D5D7DA]" />

          {/* Section: Rating */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[18px] leading-[32px] font-bold text-[#0A0D12]">
              Rating
            </h2>

            <div className="flex flex-col">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="group flex h-[46px] cursor-pointer items-center gap-2 p-2 px-0"
                >
                  <input
                    type="checkbox"
                    checked={ratingFilter === String(star)}
                    onChange={() => handleRatingChange(String(star))}
                    className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] text-[#1C65DA] checked:bg-[#1C65DA] focus:ring-0"
                  />
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="h-6 w-6 text-[#FFAB0D]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[16px] leading-[30px] font-medium text-[#0A0D12]">
                      {star}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= RIGHT CONTENT: BOOK GRID ================= */}
        <main className="w-full flex-shrink-0 md:w-[879px]">
          {isBooksLoading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[439.12px] w-[204.75px] animate-pulse rounded-[12px] bg-gray-100"
                />
              ))}
            </div>
          ) : books.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[18px] font-bold text-[#181D27]">
                No books found
              </p>
              <p className="text-[14px] text-[#414651]">
                Try adjusting your search or filter options.
              </p>
            </div>
          ) : (
            /* Active Grid List Card Book */
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
                    className="flex h-[439.12px] w-full max-w-[204.75px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.01]"
                  >
                    {/* Top Section: Cover Image 2 */}
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="h-[307.12px] w-full rounded-t-[12px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=250&auto=format&fit=crop";
                      }}
                    />

                    {/* Bottom Section: Frame 1 Info text */}
                    <div className="flex h-[132px] flex-col justify-start gap-1 bg-white p-4">
                      <h3 className="truncate text-[18px] leading-[32px] font-bold tracking-tight text-[#181D27]">
                        {book.title}
                      </h3>
                      <p className="-mt-1 truncate text-[16px] leading-[30px] font-medium tracking-tight text-[#414651]">
                        {book.authorName}
                      </p>

                      {/* Frame 3: Star Rating */}
                      <div className="mt-auto flex items-center gap-1">
                        <svg
                          className="h-6 w-6 text-[#FFAB0D]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="text-[16px] leading-[30px] font-semibold text-[#181D27]">
                          {book.rating ? book.rating.toFixed(1) : "4.9"}
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
  );
}
