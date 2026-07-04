import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router"; // Menggunakan React Router v7
import api from "~/lib/api/axios";

interface BookDetailData {
  id: string;
  title: string;
  authorName: string;
  previewUrl?: string;
  coverImage?: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  category?: {
    id: number;
    name: string;
  };
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch data detail buku utama
  const { data: bookResponse, isLoading } = useQuery({
    queryKey: ["bookDetail", id],
    queryFn: async () => {
      const res = await api.get(`/api/books/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch rekomendasi buku terkait
  const { data: relatedResponse } = useQuery({
    queryKey: ["relatedBooks", id],
    queryFn: async () => {
      const res = await api.get("/api/books", {
        params: { limit: 5 },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const book: BookDetailData = bookResponse?.data || bookResponse || null;
  const relatedBooks =
    relatedResponse?.data?.books || relatedResponse?.books || [];

  if (isLoading) {
    return (
      <div className="py-20 text-center font-quicksand">
        Loading book details...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-center font-quicksand text-red-500">
        Book not found or an error occurred.
      </div>
    );
  }

  const coverUrl =
    book.previewUrl || book.coverImage || "/images/book-placeholder.png";

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[64px] bg-white px-4 py-8 font-quicksand">
      {/* 1. BREADCRUMB NAVIGATION (Frame 102 -> Frame 101) */}
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-1 text-[14px] leading-[28px] font-semibold tracking-tight">
          <Link to="/" className="text-[#1C65DA]">
            Home
          </Link>
          <span className="mx-1 inline-block rotate-90 text-[10px] text-[#0A0D12]">
            ▼
          </span>
          <Link to="/user/books" className="text-[#1C65DA]">
            Category
          </Link>
          <span className="mx-1 inline-block rotate-90 text-[10px] text-[#0A0D12]">
            ▼
          </span>
          <span className="max-w-[200px] truncate text-[#0A0D12]">
            {book.title}
          </span>
        </div>

        {/* MAIN DETAIL HERO SECTION (Frame 19) */}
        <div className="flex w-full flex-col items-center gap-9 md:flex-row md:items-start">
          {/* Cover Container Left (Frame 7) */}
          <div className="flex h-[498px] w-full max-w-[337px] flex-shrink-0 items-center justify-center bg-[#E9EAEB] p-2">
            <img
              src={coverUrl}
              alt={book.title}
              className="h-[482px] w-[321px] object-cover shadow-sm"
            />
          </div>

          {/* Book Meta Content Right (Frame 16) */}
          <div className="flex max-w-[827px] flex-grow flex-col gap-5">
            <div className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-1">
                {/* Category Tag (Frame 13) */}
                <div className="inline-flex h-7 w-fit items-center justify-center rounded-[6px] border border-[#D5D7DA] px-2 text-[14px] font-bold text-[#0A0D12]">
                  {book.category?.name || "Business & Economics"}
                </div>
                {/* Book Title & Author */}
                <h1 className="mt-2 text-[28px] leading-[38px] font-bold tracking-tight text-[#0A0D12]">
                  {book.title}
                </h1>
                <p className="text-[16px] leading-[30px] font-semibold tracking-tight text-[#414651]">
                  {book.authorName}
                </p>
                {/* Score Rating */}
                <div className="flex items-center gap-1 text-[16px] font-bold text-[#181D27]">
                  <svg
                    className="h-6 w-6 text-[#FFAB0D]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>4.9</span>
                </div>
              </div>

              {/* Grid Mini Stock Info (Frame 11) */}
              <div className="flex h-[66px] items-center gap-[20px]">
                <div className="w-[102px]">
                  <div className="text-[24px] leading-[36px] font-bold text-[#0A0D12]">
                    {book.availableCopies}
                  </div>
                  <div className="text-[16px] leading-[30px] font-medium text-[#0A0D12] opacity-70">
                    Stock
                  </div>
                </div>
                <div className="h-[66px] border-r border-[#D5D7DA]" />
                <div className="w-[102px]">
                  <div className="text-[24px] leading-[36px] font-bold text-[#0A0D12]">
                    212
                  </div>
                  <div className="text-[16px] leading-[30px] font-medium text-[#0A0D12] opacity-70">
                    Rating
                  </div>
                </div>
                <div className="h-[66px] border-r border-[#D5D7DA]" />
                <div className="w-[102px]">
                  <div className="text-[24px] leading-[36px] font-bold text-[#0A0D12]">
                    179
                  </div>
                  <div className="text-[16px] leading-[30px] font-medium text-[#0A0D12] opacity-70">
                    Reviews
                  </div>
                </div>
              </div>
            </div>

            <hr className="w-full border-[#D5D7DA]" />

            {/* Description Body Text (Frame 14) */}
            <div className="flex flex-col gap-1">
              <h2 className="text-[20px] leading-[34px] font-bold tracking-tight text-[#0A0D12]">
                Description
              </h2>
              <p className="text-justify text-[16px] leading-[30px] font-medium tracking-tight text-[#0A0D12]">
                {book.description ||
                  "No description available for this book yet."}
              </p>
            </div>

            {/* Action Buttons Group (Frame 97) */}
            <div className="mt-4 flex gap-3">
              <button className="h-[48px] w-[200px] rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50">
                Add to Cart
              </button>
              <button className="h-[48px] w-[200px] rounded-full bg-[#1C65DA] text-[16px] font-bold tracking-tight text-white transition-colors hover:bg-[#154eb3]">
                Borrow Book
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#D5D7DA]" />

      {/* 2. REVIEWS CONTAINER SECTION (Frame 106) */}
      <div className="flex w-full flex-col gap-[18px]">
        <div className="flex w-full flex-col gap-3">
          <h2 className="text-[36px] leading-[44px] font-bold text-[#0A0D12]">
            Review
          </h2>
          <div className="flex items-center gap-1 text-[20px] leading-[34px] font-bold text-[#0A0D12]">
            <svg
              className="h-[34px] w-[34px] text-[#FFAB0D]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>4.9 (24 Ulasan)</span>
          </div>
        </div>

        {/* Double-Column Review Layout (Frame 103, 104) */}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex h-[204px] flex-col gap-4 rounded-[16px] border border-gray-50 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
            >
              {/* User Header Profile (Frame 26) */}
              <div className="flex items-start gap-3">
                <div className="h-[64px] w-[64px] overflow-hidden rounded-full bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[18px] leading-[32px] font-bold tracking-tight text-[#0A0D12]">
                    John Doe
                  </span>
                  <span className="text-[16px] leading-[30px] font-medium tracking-tight text-[#0A0D12] opacity-60">
                    25 August 2025, 13:38
                  </span>
                </div>
              </div>
              {/* Stars & Comment (Frame 27) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-[#FFAB0D]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="line-clamp-2 text-[16px] leading-[30px] font-semibold tracking-tight text-[#0A0D12]">
                  Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor
                  aliquam viverra nunc sed facilisis. Integer tristique nullam
                  morbi mauris ante.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <button className="mx-auto mt-4 h-[48px] w-[200px] rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50">
          Load More
        </button>
      </div>

      <hr className="border-[#D5D7DA]" />

      {/* 3. RELATED BOOKS SECTION (Frame 1618874005) */}
      <div className="mb-10 flex w-full flex-col gap-10">
        <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-[#0A0D12]">
          Related Books
        </h2>

        {/* Grid List Related Card (Frame 4) */}
        <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {relatedBooks.slice(0, 5).map((relBook: any) => {
            const relCoverUrl =
              relBook.previewUrl ||
              relBook.coverImage ||
              "/images/book-placeholder.png";
            return (
              <Link
                to={`/books/${relBook.id}`}
                key={relBook.id}
                className="flex h-[468px] w-full max-w-[224px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.01]"
              >
                <img
                  src={relCoverUrl}
                  alt={relBook.title}
                  className="h-[336px] w-full rounded-t-[12px] object-cover"
                />
                <div className="flex h-[132px] flex-col justify-start gap-1 bg-white p-4">
                  <h3 className="truncate text-[18px] leading-[32px] font-bold tracking-tight text-[#181D27]">
                    {relBook.title}
                  </h3>
                  <p className="-mt-1 truncate text-[16px] leading-[30px] font-medium tracking-tight text-[#414651]">
                    {relBook.authorName}
                  </p>
                  <div className="mt-auto flex items-center gap-1">
                    <svg
                      className="h-6 w-6 text-[#FFAB0D]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[16px] leading-[30px] font-semibold text-[#181D27]">
                      4.9
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
