import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import api from "~/lib/api/axios";
import { Input } from "~/components/ui/input";
import { InputGroup } from "~/components/ui/input-group";
import { toast } from "sonner"; // Asumsi sonner active di ui/sonner Bapak
import Navbar from "~/components/layout/navbar";

interface BorrowedItem {
  id: number;
  status: string;
  displayStatus: "Active" | "Returned" | "Overdue" | string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays: number;
  book: {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    author: {
      name: string;
    };
    category: {
      name: string;
    };
  };
}

export default function BorrowedListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // State Manajemen Modal Review
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [rating, setRating] = useState<number>(4); // Default 4 bintang sesuai Figma Vector
  const [comment, setComment] = useState<string>("");

  const currentStatus = searchParams.get("status") || "All";
  const searchQuery = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(searchQuery);

  // Fetch data daftar peminjaman
  const { data: loansResponse, isLoading } = useQuery({
    queryKey: ["userLoans", currentStatus, searchQuery],
    queryFn: async () => {
      const res = await api.get("/api/loans/my", {
        params: {
          status: currentStatus.toLowerCase(),
          q: searchQuery || undefined,
          page: 1,
          limit: 20,
        },
      });
      return res.data;
    },
  });

  // Kirim Review ke Backend via Mutation
  const reviewMutation = useMutation({
    mutationFn: async (payload: {
      bookId: number;
      rating: number;
      comment: string;
    }) => {
      const res = await api.post("/api/reviews", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userLoans"] });
      closeReviewModal();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    },
  });

  const loans: BorrowedItem[] = loansResponse?.data?.loans || [];

  const handleStatusFilter = (status: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("status", status);
    setSearchParams(nextParams);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const nextParams = new URLSearchParams(searchParams);
      if (keyword.trim()) {
        nextParams.set("q", keyword);
      } else {
        nextParams.delete("q");
      }
      setSearchParams(nextParams);
    }
  };

  const openReviewModal = (bookId: number, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setRating(4); // Reset ke default figma
    setComment("");
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSendReview = () => {
    if (!selectedBook) return;
    if (!comment.trim()) {
      toast.error("Please type your thoughts before sending.");
      return;
    }
    reviewMutation.mutate({
      bookId: selectedBook.id,
      rating: rating,
      comment: comment,
    });
  };

  const getStatusBadgeClass = (displayStatus: string) => {
    switch (displayStatus) {
      case "Active":
      case "Returned":
        return "bg-[rgba(36,165,0,0.05)] text-[#24A500]";
      case "Overdue":
        return "bg-[rgba(238,29,82,0.05)] text-[#EE1D52]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dateString.split("T")[0];
  };

  return (
    <div className="relative min-h-screen bg-[#FDFDFD]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 bg-white pt-8 pb-16 font-['Quicksand']">
        {/* TABS CONTROL */}
        <div className="flex h-[56px] w-[557px] items-center gap-2 rounded-[16px] bg-[#F5F5F5] p-2">
          <Link
            to="/profile"
            className="flex h-[40px] w-[175px] items-center justify-center text-[16px] font-medium text-[#535862]"
          >
            Profile
          </Link>
          <div className="flex h-[40px] w-[175px] items-center justify-center rounded-[12px] bg-white text-[16px] font-bold text-[#0A0D12] shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
            Borrowed List
          </div>
          <Link
            to="/loans/history"
            className="flex h-[40px] w-[175px] items-center justify-center text-[16px] font-medium text-[#535862]"
          >
            Reviews
          </Link>
        </div>

        <h1 className="text-[28px] leading-[38px] font-bold tracking-tight text-[#0A0D12]">
          Borrowed List
        </h1>

        {/* LOCAL SEARCH BAR */}
        <div className="w-[544px]">
          <InputGroup className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-[#535862]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search book"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="h-[44px] w-full rounded-full border border-[#D5D7DA] bg-white pr-4 pl-12 text-[14px] font-medium text-[#0A0D12] placeholder-[#535862] focus-visible:ring-gray-300"
            />
          </InputGroup>
        </div>

        {/* STATUS FILTERS */}
        <div className="flex h-[40px] items-center gap-3">
          {["All", "Active", "Returned", "Overdue"].map((status) => {
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`flex h-[40px] items-center justify-center rounded-full border px-4 text-[16px] font-semibold tracking-tight transition-all ${
                  isActive
                    ? "border-[#1C65DA] bg-[#F6F9FE] text-[#1C65DA]"
                    : "border-[#D5D7DA] bg-white text-[#0A0D12] hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* LIST CARDS */}
        <div className="mt-2 flex w-full flex-col gap-4">
          {isLoading ? (
            <p className="py-10 text-center text-gray-400">
              Loading borrowed items...
            </p>
          ) : loans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
              <p className="text-[16px] font-bold text-[#0A0D12]">
                Belum ada data peminjaman
              </p>
              <p className="text-[14px] text-gray-400">
                Buku yang Anda cari atau pinjam tidak ditemukan.
              </p>
            </div>
          ) : (
            loans.map((item) => {
              const bookCover =
                item.book?.coverImage || "/images/book-placeholder.png";
              return (
                <div
                  key={item.id}
                  className="flex h-[250px] w-[1000px] flex-col gap-[20px] rounded-[16px] border border-gray-50 bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
                >
                  <div className="flex h-[32px] w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] leading-[30px] font-bold text-[#0A0D12]">
                        Status
                      </span>
                      <div
                        className={`flex h-[32px] items-center justify-center rounded-[4px] px-2 py-0.5 text-[14px] font-bold ${getStatusBadgeClass(item.displayStatus)}`}
                      >
                        {item.displayStatus}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] leading-[30px] font-bold text-[#0A0D12]">
                        Due Date
                      </span>
                      <div className="flex h-[32px] items-center justify-center rounded-[4px] bg-[rgba(238,29,82,0.1)] px-2 py-0.5 text-[14px] font-bold text-[#0A0D12]">
                        {formatDate(item.dueAt)}
                      </div>
                    </div>
                  </div>

                  <hr className="w-full border-[#D5D7DA]" />

                  <div className="flex h-[138px] w-full items-center justify-between">
                    <div className="flex h-full items-center gap-4">
                      <img
                        src={bookCover}
                        alt={item.book?.title}
                        className="h-[138px] w-[92px] rounded-[4px] object-cover"
                      />
                      <div className="flex h-[134px] flex-col justify-start gap-1">
                        <div className="inline-flex h-7 w-fit items-center justify-center rounded-[6px] border border-[#D5D7DA] px-2 text-[14px] font-bold text-[#0A0D12]">
                          {item.book?.category?.name || "Category"}
                        </div>
                        <h3 className="max-w-[500px] truncate text-[20px] leading-[34px] font-bold tracking-tight text-[#0A0D12]">
                          {item.book?.title}
                        </h3>
                        <p className="-mt-1 text-[16px] leading-[30px] font-medium text-[#414651]">
                          {item.book?.author?.name || "Author"}
                        </p>
                        <div className="flex items-center gap-2 text-[16px] leading-[30px] font-bold text-[#0A0D12]">
                          <span>{formatDate(item.borrowedAt)}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0A0D12]" />
                          <span>Duration {item.durationDays} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTON - Memicu Modal Ulasan Pop-Up */}
                    <button
                      type="button"
                      onClick={() =>
                        openReviewModal(item.book.id, item.book.title)
                      }
                      className="flex h-[40px] w-[182px] cursor-pointer items-center justify-center rounded-full bg-[#1C65DA] text-[16px] font-bold text-[#FDFDFD] transition-colors hover:bg-[#154eb3]"
                    >
                      Give Review
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* LOAD MORE */}
        {!isLoading && loans.length >= 10 && (
          <button className="mx-auto mt-4 h-[48px] w-[200px] rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50">
            Load More
          </button>
        )}
      </div>

      {/* BACKDROP & INTERACTIVE REVIEW MODAL  */}
      {isModalOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Box Container Modal */}
          <div
            className="relative flex scale-100 flex-col items-center gap-[24px] border border-gray-100 bg-[#FFFFFF] p-[24px] shadow-2xl transition-all"
            style={{
              width: "439px",
              height: "518px",
              borderRadius: "16px",
            }}
          >
            {/* Header Modal */}
            <div className="flex h-[36px] w-[387px] flex-row items-center justify-between p-0">
              <h2 className="Aquarium font-['Quicksand'] text-[24px] leading-[36px] font-bold text-[#0A0D12]">
                Give Review
              </h2>
              {/* x-close button */}
              <button
                type="button"
                onClick={closeReviewModal}
                className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-sm border-2 border-[#0A0D12] transition-colors hover:bg-gray-100"
              >
                <span className="-mt-[2px] text-[14px] leading-none font-bold">
                  ✕
                </span>
              </button>
            </div>

            {/* Section Rating Header & Stars Container */}
            <div className="flex h-[79px] w-[391px] flex-col items-center justify-center gap-2 p-0">
              <span className="h-[30px] w-[391px] text-center font-['Quicksand'] text-[16px] leading-[30px] font-bold text-[#0A0D12]">
                Give Rating
              </span>

              {/* Row 5 Stars Clickable */}
              <div className="flex h-[49px] w-[391px] flex-row items-center justify-center gap-[4.08px] p-0">
                {[1, 2, 3, 4, 5].map((starIdx) => {
                  const isFilled = starIdx <= rating;
                  return (
                    <button
                      key={starIdx}
                      type="button"
                      onClick={() => setRating(starIdx)}
                      className="flex h-[49px] w-[49px] cursor-pointer items-center justify-center text-[40px] transition-transform hover:scale-110 focus:outline-none"
                      style={{ color: isFilled ? "#FDB022" : "#A4A7AE" }}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputfield Textarea */}
            <div className="box-sizing-border-box items-flex-start flex h-[235px] w-[391px] flex-row justify-center gap-[8px] rounded-[12px] border border-[#D5D7DA] bg-white p-[8px_12px]">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please share your thoughts about this book"
                className="h-[210px] w-[367px] resize-none border-none bg-transparent font-['Quicksand'] text-[16px] leading-[30px] font-medium tracking-[-0.03em] text-[#0A0D12] placeholder-[#717680] focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSendReview}
              disabled={reviewMutation.isPending}
              className="flex h-[48px] w-[391px] cursor-pointer flex-row items-center justify-center gap-[8px] rounded-[200px] bg-[#1C65DA] p-[8px] shadow-md transition-colors hover:bg-[#154eb3] disabled:opacity-50"
            >
              <span className="flex h-[30px] w-[38px] items-center justify-center text-center font-['Quicksand'] text-[16px] leading-[30px] font-bold tracking-[-0.02em] text-[#FDFDFD]">
                {reviewMutation.isPending ? "..." : "Send"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
