import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import api from "~/lib/api/axios";

interface RecommendBook {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  author: {
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export default function RecommendBooks() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Params (default: by=rating, limit=8)
  const currentBy = searchParams.get("by") || "rating";
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Mengambil daftar kategori untuk dropdown filter pencarian
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });
  //   const categories = categoriesResponse?.data || [];

  const categories = Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data
    : Array.isArray(categoriesResponse?.data?.categories)
      ? categoriesResponse.data.categories
      : [];

  // Hit endpoint Swagger: /api/books/recommend
  const { data: recommendResponse, isLoading } = useQuery({
    queryKey: ["recommendBooks", currentBy, currentCategoryId, currentPage],
    queryFn: async () => {
      const res = await api.get("/api/books/recommend", {
        params: {
          by: currentBy,
          categoryId: currentCategoryId || undefined,
          page: currentPage,
          limit: 8,
        },
      });
      return res.data;
    },
  });

  const books: RecommendBook[] = recommendResponse?.data?.books || [];
  const pagination = recommendResponse?.data?.pagination || { totalPages: 1 };

  const handleFilterBy = (mode: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("by", mode);
    nextParams.set("page", "1"); // reset page
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (catId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId) {
      nextParams.set("categoryId", catId);
    } else {
      nextParams.delete("categoryId");
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", nextPage.toString());
    setSearchParams(nextParams);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[40px] bg-white px-4 py-8 font-quicksand">
      {/* HEADER SECTION (Frame 20 -> Recommendation) */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center">
        <h1 className="text-[36px] leading-[44px] font-bold text-[#0A0D12]">
          Recommendation
        </h1>

        {/* CONTROLS & FILTER BAR */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Jenis Rekomendasi (by Rating / Borrow Count) */}
          <div className="flex h-[40px] rounded-xl bg-[#F5F5F5] p-1">
            <button
              onClick={() => handleFilterBy("rating")}
              className={`rounded-lg px-4 text-[14px] font-bold transition-all ${
                currentBy === "rating"
                  ? "bg-white text-[#0A0D12] shadow-sm"
                  : "text-[#535862]"
              }`}
            >
              Top Rating
            </button>
            <button
              onClick={() => handleFilterBy("borrowed")} // Sesuai alternatif parameter 'by'
              className={`rounded-lg px-4 text-[14px] font-bold transition-all ${
                currentBy === "borrowed"
                  ? "bg-white text-[#0A0D12] shadow-sm"
                  : "text-[#535862]"
              }`}
            >
              Most Borrowed
            </button>
          </div>

          {/* Dropdown Filter Kategori */}
          <select
            value={currentCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="h-[40px] rounded-xl border border-[#D5D7DA] bg-white px-3 text-[14px] font-semibold text-[#0A0D12] outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) &&
              categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            {/* Fallback option jika data belum termuat */}
            <option value="11">Science</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTAINER BODY CARD (Frame 6 & Frame 4) */}
      <div className="min-h-[500px] w-full">
        {isLoading ? (
          <div className="py-20 text-center text-[18px] text-gray-400">
            Loading recommendations...
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-gray-200 py-20 text-center text-gray-400">
            No recommendation books found matching criteria.
          </div>
        ) : (
          /* Grid auto-wrap responsive dengan patokan lebar item 224px figma */
          <div className="grid w-full grid-cols-2 justify-center gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:justify-start">
            {books.map((book) => {
              const coverUrl =
                book.coverImage || "/images/book-placeholder.png";
              return (
                <Link
                  to={`/books/${book.id}`}
                  key={book.id}
                  className="flex h-[468px] w-full max-w-[224px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.01]"
                >
                  {/* Image Area Cover (Lebar: 224px, Tinggi: 336px) */}
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="h-[336px] w-full rounded-t-[12px] object-cover"
                  />

                  {/* Meta Text Area Box (Frame 1 - Tinggi: 132px, Padding: 16px) */}
                  <div className="flex h-[132px] flex-col gap-1 bg-white p-4">
                    <h3 className="truncate text-[18px] leading-[32px] font-bold tracking-tight text-[#181D27]">
                      {book.title}
                    </h3>
                    <p className="-mt-1 truncate text-[16px] leading-[30px] font-medium tracking-tight text-[#414651]">
                      {book.author?.name || "Unknown Author"}
                    </p>

                    {/* Star Container Row (Frame 3) */}
                    <div className="mt-auto flex h-[30px] items-center gap-1">
                      <svg
                        className="h-6 w-6 text-[#FFAB0D]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-[16px] leading-[30px] font-semibold text-[#181D27]">
                        {book.rating > 0 ? book.rating.toFixed(1) : "0.0"}
                      </span>
                      <span className="ml-1 text-[12px] font-normal text-gray-400">
                        ({book.reviewCount})
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION OR LOAD MORE REGION */}
      {!isLoading && books.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="h-[40px] rounded-full border border-[#D5D7DA] px-4 text-[14px] font-bold text-[#0A0D12] transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-4 text-[14px] font-bold text-[#0A0D12]">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="h-[40px] rounded-full border border-[#D5D7DA] px-4 text-[14px] font-bold text-[#0A0D12] transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
