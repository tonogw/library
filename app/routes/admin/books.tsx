import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query/keys";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link, Navigate } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { InputGroup } from "~/components/ui/input-group";
import { Search, Star } from "lucide-react";
// import { negative } from "zod"

export default function AdminBookList() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  // Fetching data dari endpoint /api/admin/books
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminBooks({ search, status, page }),
    queryFn: async () => {
      const response = await api.get("/api/admin/books", {
        params: {
          status,
          q: search || undefined,
          page,
          limit: 20,
        },
      });
      return response.data;
    },
  });

  const booksList = data?.data?.books || [];
  const totalEntries = data?.data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalEntries / 20);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      setSearch(keyword);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (val === "") {
      setPage(1);
      setSearch("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-['Quicksand']">
      <Navbar />

      <main className="mx-auto max-w-[1200px] py-6">
        {/* TABS MENU UTAMA */}
        <div className="text-14 mb-8 flex w-fit gap-2 rounded-xl bg-gray-100 p-1.5 font-bold text-gray-500">
          <Link
            to="/admin/loans"
            className="rounded-lg px-6 py-2 text-gray-500 no-underline transition-colors hover:bg-white/50"
          >
            Borrowed List
          </Link>
          <Link
            to="/admin/users"
            className="rounded-lg px-6 py-2 text-gray-500 no-underline transition-colors hover:bg-white/50"
          >
            User
          </Link>
          <Link
            to="/admin/books"
            className="rounded-lg bg-white px-6 py-2 text-[#0A0D12] no-underline shadow-xs"
          >
            Book List
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-28 font-bold text-[#0A0D12]">Book List</h1>
          {/* <button className="text-14 cursor-pointer rounded-full bg-[#1C65DA] px-6 py-2.5 font-bold text-white hover:bg-[#154eb3]">
            + Tambah Buku
          </button> */}
          <Button>Add Book</Button>
        </div>

        {/* CONTROLS SEARCH & FILTER */}
        <div className="mb-6 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full max-w-md">
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"> */}
            {/* <InputGroup */}

            {/* <Search
                className={`h-5 w-5 ${isFetching ? "animate-pulse text-[#1C65DA]" : "text-gray-400"}`}
              /> */}
            {/* </div> */}
            {/* <Input
              id="book-search"
              name="q"
              type="text"
              placeholder="Search judul buku / author lalu Enter..."
              value={keyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="text-14 h-12 w-full rounded-full border border-gray-200 bg-white pr-4 pl-12 text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
            /> */}
            <InputGroup className="relative w-full">
              {/* Container Ikon Gambar Sendiri */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                <img
                  src="/icons/Search.svg"
                  alt="Search Icon"
                  className={`h-5 w-5 ${isFetching ? "animate-pulse" : ""}`}
                />
              </div>

              {/* Elemen Input Berdiri Sejajar dengan Ikon, Bukan di Dalamnya */}
              <Input
                id="book-search"
                name="q"
                type="text"
                placeholder="Search judul buku / author lalu Enter..."
                value={keyword}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="text-14 h-12 w-full rounded-full border border-gray-200 bg-white pr-4 pl-12 font-quicksand text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
              />
            </InputGroup>
          </div>

          <div className="text-12 flex gap-2 rounded-lg border border-gray-100 bg-gray-50 p-1 font-bold text-gray-500">
            {["all", "available", "borrowed", "returned"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setPage(1);
                  setStatus(item);
                }}
                className={`cursor-pointer rounded-md px-4 py-1.5 capitalize transition-all ${
                  status === item
                    ? "bg-white font-extrabold text-[#1C65DA] shadow-xs"
                    : "hover:text-gray-800"
                }`}
              >
                {item === "available"
                  ? "Ada Stok"
                  : item === "borrowed"
                    ? "Dipinjam"
                    : item === "returned"
                      ? "Kembali"
                      : "Semua"}
              </button>
            ))}
          </div>
        </div>

        {/* RESTRUKTURISASI: FIGMA LIST LAYOUT CONTAINER */}
        <div className="flex w-full max-w-[1200px] flex-col gap-4">
          {isLoading ? (
            <div className="py-20 text-center font-semibold text-gray-400">
              Loading library assets...
            </div>
          ) : booksList.length === 0 ? (
            <div className="py-20 text-center font-semibold text-gray-400">
              Tidak ada koleksi buku yang cocok.
            </div>
          ) : (
            booksList.map((book: any) => (
              /* INDIVIDUAL FIGMA CARD COMPONENT */
              <div
                key={book.id}
                className="flex h-[178px] w-full flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-all hover:shadow-[0px_0px_25px_rgba(203,202,202,0.4)]"
              >
                {/* Sisi Kiri: Gambar dan Meta Detail */}
                <div className="flex grow flex-row items-center gap-4">
                  <img
                    src={
                      book.coverImage ||
                      "/images/coverBook-psychologyOfMoney.png"
                    }
                    alt={book.title}
                    className="h-[138px] w-[92px] flex-none rounded bg-gray-50 object-cover"
                    // IF BLOCKED CORS: 403/404
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (
                        target.src !== "/images/coverBook-psychologyOfMoney.png"
                      )
                        target.src = "/images/coverBook-psychologyOfMoney.png";
                    }}
                  />

                  <div className="flex flex-grow flex-col items-start gap-1">
                    {/* Badge Kategori */}
                    <div className="box-sizing flex h-7 flex-row items-center justify-center rounded-md border border-[#D5D7DA] bg-white px-2">
                      <span className="text-14 font-bold tracking-tight text-[#0A0D12]">
                        {book.category?.name || "Uncategorized"}
                      </span>
                    </div>

                    {/* Judul Buku */}
                    <h2 className="text-18 m-0 max-w-[741px] truncate leading-8 font-bold tracking-tight text-[#0A0D12]">
                      {book.title}
                    </h2>

                    {/* Penulis / Author */}
                    <p className="text-16 m-0 leading-7 font-medium tracking-tight text-[#414651]">
                      {book.author?.name || "Unknown Author"}
                    </p>

                    {/* Star Rating Section */}
                    <div className="flex h-7 flex-row items-center gap-0.5">
                      <Star className="h-5 w-5 fill-[#FFAB0D] text-[#FFAB0D]" />
                      <span className="text-16 pl-1 leading-7 font-bold tracking-tight text-[#181D27]">
                        {book.rating || "4.9"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Tiga Tombol Aksi Elips (Pill Buttons) */}
                <div className="flex flex-none flex-row items-center gap-3 pl-4">
                  <Button variant="outline" asChild className="w-23.75">
                    <Link to={`/admin/books/${book.id}/preview`}>Preview</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-23.75">
                    <Link to={`/admin/books/${book.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-23.75 text-red-500"
                  >
                    <Link to={""}>Delete</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER PAGINATION SYSTEM */}
        {totalEntries > 0 && (
          <div className="text-14 mt-8 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-gray-50 pt-4 font-semibold text-gray-500 sm:flex-row">
            <div>
              Showing {Math.min((page - 1) * 20 + 1, totalEntries)} to{" "}
              {Math.min(page * 20, totalEntries)} of {totalEntries} entries
            </div>

            <div className="flex items-center gap-1 font-['Quicksand']">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage((p) => p - 1);
                      }}
                      href="#"
                      className={
                        page === 1
                          ? "pointer-events-none opacity-40"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(1);
                      }}
                      href="#"
                      isActive={page === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {page > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page - 1);
                        }}
                        href="#"
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page !== 1 && page !== totalPages && (
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                        href="#"
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(totalPages);
                        }}
                        href="#"
                        isActive={page === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (page * 20 < totalEntries) setPage((p) => p + 1);
                      }}
                      href="#"
                      className={
                        page * 20 >= totalEntries
                          ? "pointer-events-none opacity-40"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
