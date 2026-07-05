import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router"; // Menggunakan React Router v7
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { useInstantBorrow } from "~/lib/query/useBorrow";

import type { BookDetailData } from "~/types";
import type { ReviewItem } from "~/types";

// interface ReviewItem {
//   id: number;
//   star: number;
//   comment: string;
//   userId: number;
//   bookId: number;
//   createdAt: string;
//   user: {
//     id: number;
//     name: string;
//   };
// }

// interface BookDetailData {
//   id: number;
//   title: string;
//   description: string;
//   isbn: string;
//   publishedYear: number;
//   coverImage?: string;
//   rating: number;
//   reviewCount: number;
//   totalCopies: number;
//   availableCopies: number;
//   borrowCount: number;
//   createdAt: string;
//   updatedAt: string;
//   author?: {
//     id: number;
//     name: string;
//     bio: string;
//   };
//   category?: {
//     id: number;
//     name: string;
//   };
//   reviews?: ReviewItem[];
// }

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [visibleCount, setVisibleCount] = useState(6);
  const borrowInstantMutation = useInstantBorrow(id);

  // Jika ID buku berubah dari rekomendasi bawah, kembalikan batas pagination awal ke 6 review
  useEffect(() => {
    setVisibleCount(6);
  }, [id]);

  // Fetch data detail buku utama
  const { data: bookResponse, isLoading: isBookLoading } = useQuery({
    queryKey: ["bookDetail", id],
    queryFn: async () => {
      console.log("Fetching", id);
      const res = await api.get(`/api/books/${id}`);

      console.log(res);
      return res.data;
    },
    enabled: !!id,
  });

  // Ambil data profile pribadi yang sedang login
  console.log("id =", id);
  const { data: meResponse } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      const res = await api.get("/api/me");
      return res.data;
    },
  });

  // Fetch infinite reviewer
  const {
    data: reviewsInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isReviewsLoading,
  } = useInfiniteQuery({
    queryKey: ["bookReviewsInfinite", id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/api/books/${id}`, {
        params: { page: pageParam },
      });
      return res.data?.data?.reviews || [];
    },
    initialPageParam: 1,
    enabled: !!id,

    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flat().length;
      const targetTotal = bookResponse?.data?.reviewCount || 0;

      if (totalFetched >= targetTotal || lastPage.length === 0) {
        return undefined;
      }
      // if (lastPage.length < 10) return undefined;
      return allPages.length + 1;
    },
  });

  // Fetch rekomendasi buku terkait
  const { data: relatedResponse } = useQuery({
    queryKey: ["relatedBooks", id],
    queryFn: async () => {
      const res = await api.get("/api/books", {
        params: { limit: 6 },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      //   console.log("mutation start")
      //   // return await api.post("/api/cart/items", {

      const res = await api.post("/api/cart/items", {
        bookId: Number(id),
      });
      //   console.log(res)
      return res.data;
    },
    // mutationFn:async ()=> {
    //   return await api.post("/api/cart/items", {
    //     bookId: Number(id),
    //   });
    // },

    onSuccess: (resData) => {
      toast.success(resData?.message || "Successfully added to cart!");
      queryClient.invalidateQueries({ queryKey: ["userCartItems"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Failed to add to cart.";
      toast.error(errorMsg);
    },
  });

  if (isBookLoading) {
    // if (isBookLoading || isReviewsLoading) {
    return (
      <div className="py-20 text-center font-quicksand text-[18px] text-gray-400">
        Loading book details...
      </div>
    );
  }

  const book: BookDetailData = bookResponse?.data || null;
  if (!book) {
    return (
      <div className="py-20 text-center font-quicksand text-[18px] text-red-500">
        Book not found or an error occurred.
      </div>
    );
  }

  const currentUserId = meResponse?.data?.profile?.id;
  const currentUserPhoto = meResponse?.data?.profile?.profilePhoto;

  // const reviewsList = book?.reviews || [];
  const reviewsList = reviewsInfiniteData?.pages.flat() || [];
  const relatedBooks =
    relatedResponse?.data?.books || relatedResponse?.books || [];
  const coverUrl = book.coverImage || "/images/book-placeholder.png";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    return dateString.split("T")[0];
  };

  return (
    <main>
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[64px] bg-white px-4 py-8 font-quicksand">
        {/* 1. BREADCRUMB NAVIGATION */}
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
            <span className="max-w-[200px] truncate text-[#0A0D12] opacity-70">
              {book.title}
            </span>
          </div>

          {/* MAIN DETAIL HERO SECTION */}
          <div className="flex w-full flex-col items-center gap-9 md:flex-row md:items-start">
            <div className="flex h-[498px] w-full max-w-[337px] flex-shrink-0 items-center justify-center rounded-xl bg-[#E9EAEB] p-2">
              <img
                src={coverUrl}
                alt={book.title}
                className="h-[482px] w-[321px] rounded-lg object-cover shadow-sm"
              />
            </div>

            <div className="flex max-w-[827px] flex-grow flex-col gap-5">
              <div className="flex flex-col gap-[22px]">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex h-7 w-fit items-center justify-center rounded-[6px] border border-[#D5D7DA] px-2 text-[14px] font-bold text-[#0A0D12]">
                    {book.category?.name || "Non-Fiction"}
                  </div>
                  <h1 className="mt-2 text-[28px] leading-[38px] font-bold tracking-tight text-[#0A0D12]">
                    {book.title}
                  </h1>
                  <p className="-mt-0.5 text-[16px] leading-[30px] font-semibold tracking-tight text-[#414651]">
                    {book.author?.name || "Unknown Author"}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[16px] font-bold text-[#181D27]">
                    <svg
                      className="h-6 w-6 text-[#FFAB0D]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>
                      {book.rating > 0 ? book.rating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex h-[66px] items-center gap-[20px]">
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
                      {book.rating > 0 ? book.rating.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-[16px] leading-[30px] font-medium text-[#0A0D12] opacity-70">
                      Rating
                    </div>
                  </div>
                  <div className="h-[66px] border-r border-[#D5D7DA]" />
                  <div className="w-[102px]">
                    <div className="text-[24px] leading-[36px] font-bold text-[#0A0D12]">
                      {book.reviewCount}
                    </div>
                    <div className="text-[16px] leading-[30px] font-medium text-[#0A0D12] opacity-70">
                      Reviews
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-2 w-full border-[#D5D7DA]" />

              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[34px] font-bold tracking-tight text-[#0A0D12]">
                  Description
                </h2>
                <p className="text-justify text-[16px] leading-[30px] font-medium tracking-tight text-[#0A0D12] opacity-90">
                  {book.description ||
                    "No description available for this book yet."}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                {/* ADD TO CART */}
                <Button
                  variant="default"
                  type="button"
                  onClick={() => {
                    console.log("Navigasi ke halaman keranjang...");
                    navigate("/user/cart");
                  }}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   e.stopPropagation();

                  //   console.log("tombol add to cart di klik, mengirim ID:", id);
                  //   addToCartMutation.mutate();
                  // }}
                  // disabled={
                  //   addToCartMutation.isPending || book.availableCopies === 0
                  // }
                  className="h-[48px] w-[200px] cursor-pointer rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                {/* BORROW BOOK */}
                <button
                  // variant="default"
                  type="button"
                  onClick={() => {
                    console.log("Navigasi ke halaman daftar pinjaman ...");
                    navigate("/loans/${}");
                  }}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   e.stopPropagation();
                  //   borrowInstantMutation.mutate();
                  // }}

                  // disabled={
                  //   borrowInstantMutation.isPending ||
                  //   book.availableCopies === 0
                  // }
                  className="h-[48px] w-[200px] rounded-full bg-[#1C65DA] text-[16px] font-bold tracking-tight text-white transition-colors hover:bg-[#154eb3]"
                >
                  {borrowInstantMutation.isPending
                    ? "Borrowing ... "
                    : "Borrow Book"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#D5D7DA]" />

        {/* 2. REVIEWS CONTAINER SECTION */}
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
              <span>{book.rating > 0 ? book.rating.toFixed(1) : "0.0"} </span>
              <span className="font-medium text-gray-500">
                ({book.reviewCount} Reviews)
              </span>
            </div>
          </div>

          {reviewsList.length === 0 ? (
            <div className="flex w-full items-center justify-center rounded-[16px] border border-dashed border-gray-200 py-16">
              <p className="text-[18px] font-bold tracking-tight text-gray-400">
                No Book Review Yet
              </p>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              {/* {reviewsList.slice(0, visibleCount).map((reviewItem) => { */}
              {reviewsList.map((reviewItem) => {
                const isMyReview = reviewItem.userId === currentUserId;
                const reviewName = reviewItem.user?.name || "Anonymous User";
                const avatarUrl =
                  isMyReview && currentUserPhoto
                    ? currentUserPhoto
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewName)}&background=E0ECFF&color=1C65DA&bold=true&size=128`;

                return (
                  <div
                    key={reviewItem.id}
                    className="flex h-[204px] flex-col gap-4 rounded-[16px] border border-gray-50 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-[64px] w-[64px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src={avatarUrl}
                          alt={reviewName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[18px] leading-[32px] font-bold tracking-tight text-[#0A0D12]">
                          {reviewName}
                          {isMyReview && (
                            <span className="ml-1 text-[12px] font-normal text-gray-400">
                              {" "}
                              (You)
                            </span>
                          )}
                        </span>
                        <span className="text-[14px] leading-[24px] font-medium tracking-tight text-[#0A0D12] opacity-60">
                          {formatDate(reviewItem.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex min-h-0 flex-col gap-2">
                      <div className="flex items-center text-[#FFAB0D]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < reviewItem.star ? "text-[#FFAB0D]" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="line-clamp-3 overflow-y-auto text-[16px] leading-[26px] font-medium tracking-tight text-[#0A0D12] opacity-90">
                        {reviewItem.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* {reviewsList && reviewsList.length > visibleCount && ( */}
          {/* {book && book.reviewCount > visibleCount && ( */}
          {hasNextPage && (
            <Button
              variant="ghost"
              // onClick={() => setVisibleCount((prev) => prev + 6)}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mx-auto mt-4 h-[48px] w-[200px] rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50"
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          )}
        </div>

        <hr className="border-[#D5D7DA]" />

        {/* 3. RELATED BOOKS SECTION */}
        <div className="mb-10 flex w-full flex-col gap-10">
          <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-[#0A0D12]">
            Related Books
          </h2>

          <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedBooks.slice(0, 5).map((relBook: any) => {
              const relCoverUrl =
                relBook.coverImage || "/images/book-placeholder.png";
              return (
                <button
                  onClick={() => {
                    navigate(`/books/${relBook.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  key={relBook.id}
                  className="flex h-[468px] w-full max-w-[224px] flex-col overflow-hidden rounded-[12px] bg-white text-left shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.01]"
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
                      {relBook.author?.name || "Unknown Author"}
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
                        {relBook.rating > 0 ? relBook.rating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
