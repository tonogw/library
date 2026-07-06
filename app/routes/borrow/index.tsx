import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router"; // Menggunakan React Router v7
import api from "~/lib/api/axios";
import { Input } from "~/components/ui/input";
import { InputGroup } from "~/components/ui/input-group";
import type { BorrowedItem } from "~/types";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";

export default function BorrowedListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil state filter aktif dari URL (Default: All)
  const currentStatus = searchParams.get("status") || "All";
  const searchQuery = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(searchQuery);

  // Fetch data daftar peminjaman pribadi dari Swagger /api/loans/my
  const { data: loansResponse, isLoading } = useQuery({
    queryKey: ["userLoans", currentStatus, searchQuery],
    queryFn: async () => {
      const res = await api.get("/api/loans/my", {
        params: {
          status: currentStatus.toLowerCase(), // 'all' | 'active' | 'returned' | 'overdue'
          q: searchQuery || undefined,
          page: 1,
          limit: 20,
        },
      });
      return res.data;
    },
  });

  // Pemetaan array dari response body swagger secara presisi
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

  const getStatusBadgeClass = (displayStatus: string) => {
    switch (displayStatus) {
      case "Active":
        return "bg-[rgba(36,165,0,0.05)] text-[#24A500]";
      case "Returned":
        return "bg-[rgba(36,165,0,0.05)] text-[#24A500]";
      case "Overdue":
        return "bg-[rgba(238,29,82,0.05)] text-[#EE1D52]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper pemformat tanggal sederhana (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dateString.split("T")[0];
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 bg-white pt-8 pb-16 font-quicksand">
        {/* 1. TOP TABS CONTROL (Sesuai Desain Figma Library) */}
        <div className="flex h-[56px] w-[557px] items-center gap-2 rounded-2xl bg-[#F5F5F5] p-2">
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

        {/* 2. LOCAL SEARCH BAR */}
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

        {/* 3. FILTER PILL STATUS BUTTONS */}
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

        {/* 4. LIST BORROWED CARDS */}
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
                  {/* Atas: Status & Due Date */}
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

                  {/* Garis Pembatas Line 9 */}
                  <hr className="w-full border-[#D5D7DA]" />

                  {/* Bawah: Detail Buku & Tombol Review */}
                  <div className="flex h-[138px] w-full items-center justify-between">
                    <div className="flex h-full items-center gap-4">
                      <img
                        src={bookCover}
                        alt={item.book?.title}
                        className="h-[138px] w-[92px] rounded-[4px] object-cover"
                      />
                      <div className="flex h-[134px] flex-col justify-start gap-1">
                        {/* Tag Kategori */}
                        <div className="inline-flex h-7 w-fit items-center justify-center rounded-[6px] border border-[#D5D7DA] px-2 text-[14px] font-bold text-[#0A0D12]">
                          {item.book?.category?.name || "Category"}
                        </div>
                        {/* Nama Buku */}
                        <h3 className="max-w-[500px] truncate text-[20px] leading-[34px] font-bold tracking-tight text-[#0A0D12]">
                          {item.book?.title}
                        </h3>
                        {/* Nama Penulis */}
                        <p className="-mt-1 text-[16px] leading-[30px] font-medium text-[#414651]">
                          {item.book?.author?.name || "Author"}
                        </p>
                        {/* Tanggal Pinjam & Durasi */}
                        <div className="flex items-center gap-2 text-[16px] leading-[30px] font-bold text-[#0A0D12]">
                          <span>{formatDate(item.borrowedAt)}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0A0D12]" />
                          <span>Duration {item.durationDays} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi Kanan */}
                    <Link
                      to={`/books/${item.book?.id}`}
                      className="flex h-[40px] w-[182px] items-center justify-center rounded-full bg-[#1C65DA] text-[16px] font-bold text-[#FDFDFD] transition-colors hover:bg-[#154eb3]"
                    >
                      Give Review
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. BUTTON LOAD MORE */}
        {!isLoading && loans.length >= 10 && (
          <button className="mx-auto mt-4 h-[48px] w-[200px] rounded-full border border-[#D5D7DA] text-[16px] font-bold tracking-tight text-[#0A0D12] transition-colors hover:bg-gray-50">
            Load More
          </button>
        )}
      </div>
      <Footer />
    </>
  );
}
