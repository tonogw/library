import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query/keys";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { Input } from "~/components/ui/input";
import { Link } from "react-router"; // 1. Import Link untuk navigasi antar halaman admin
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminUserList() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminUsers(search, page),
    queryFn: async () => {
      const response = await api.get("/api/admin/users", {
        params: {
          q: search || undefined,
          page,
          limit: 10,
        },
      });
      return response.data;
    },
  });

  const usersList = data?.data?.users || [];
  const totalEntries = data?.data?.pagination?.total || 0;

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
    <div className="w-full bg-white font-['Quicksand']">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
        {/* ✓ TOMBOL SELECTOR AKTIF: Menggunakan Link React Router */}
        <div className="text-14 mb-8 flex w-fit gap-2 rounded-xl bg-gray-100 p-1.5 font-bold text-gray-500">
          <Link
            to="/admin/loans"
            className="rounded-lg px-6 py-2 text-gray-500 no-underline transition-colors hover:bg-white/50"
          >
            Borrowed List
          </Link>
          <Link
            to="/admin/users"
            className="rounded-lg bg-white px-6 py-2 text-[#1C65DA] no-underline shadow-xs"
          >
            User
          </Link>
          <Link
            to="/admin/books"
            className="rounded-lg px-6 py-2 text-gray-500 no-underline transition-colors hover:bg-white/50"
          >
            Book List
          </Link>
        </div>

        <h1 className="text-28 mb-4 font-bold text-[#0A0D12]">User</h1>

        {/* INPUT GROUP SEARCH DASHBOARD */}
        <div className="relative mb-6 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search
              className={`h-5 w-5 ${isFetching ? "animate-pulse text-[#1C65DA]" : "text-gray-400"}`}
            />
          </div>
          <Input
            type="text"
            placeholder="Search nama user di sini lalu Enter..."
            value={keyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="text-14 h-12 w-full rounded-full border border-gray-200 bg-white pr-4 pl-12 font-['Quicksand'] text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
          />
        </div>

        {/* SHADCN TABLE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-14 h-12 w-16 px-4 font-bold text-[#0A0D12]">
                  No
                </TableHead>
                <TableHead className="text-14 h-12 px-4 font-bold text-[#0A0D12]">
                  Name
                </TableHead>
                <TableHead className="text-14 h-12 px-4 font-bold text-[#0A0D12]">
                  Nomor Handphone
                </TableHead>
                <TableHead className="text-14 h-12 px-4 font-bold text-[#0A0D12]">
                  Email
                </TableHead>
                <TableHead className="text-14 h-12 px-4 font-bold text-[#0A0D12]">
                  Created at
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-14 font-semibold text-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-400"
                  >
                    Loading users records...
                  </TableCell>
                </TableRow>
              ) : usersList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-400"
                  >
                    Tidak ada user dengan nama "{search}"
                  </TableCell>
                </TableRow>
              ) : (
                usersList.map((user: any, index: number) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/40"
                  >
                    <TableCell className="px-4 py-4 font-bold text-[#0A0D12]">
                      {(page - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-bold text-[#0A0D12]">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-600">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-normal text-gray-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {totalEntries > 0 && (
            <div className="text-14 mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-50 pt-4 font-semibold text-gray-500 sm:flex-row">
              <div>
                Showing {Math.min((page - 1) * 10 + 1, totalEntries)} to{" "}
                {Math.min(page * 10, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1 font-['Quicksand']">
                {/* <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-bold text-[#0A0D12] transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <button
                  className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${page === 1 ? "bg-gray-100 text-[#0A0D12]" : "text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setPage(1)}
                >
                  1
                </button>

                {totalEntries > 10 && (
                  <button
                    className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${page === 2 ? "bg-gray-100 text-[#0A0D12]" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => setPage(2)}
                  >
                    2
                  </button>
                )}

                <button
                  disabled={page * 10 >= totalEntries}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-bold text-[#0A0D12] transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button> */}
                <Pagination>
                  <PaginationContent>
                    {/* Tombol Previous */}
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

                    {/* Halaman Pertama (Selalu 1) */}
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

                    {/* Halaman Tengah Dinamis Aktif */}
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

                    {page !== 1 && page !== Math.ceil(totalEntries / 10) && (
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {page < Math.ceil(totalEntries / 10) - 1 && (
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

                    {/* Titik-titik Ellipsis */}
                    {page < Math.ceil(totalEntries / 10) - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Halaman Terakhir (Menggunakan Math.ceil bulat total) */}
                    {Math.ceil(totalEntries / 10) > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.ceil(totalEntries / 10));
                          }}
                          href="#"
                          isActive={page === Math.ceil(totalEntries / 10)}
                        >
                          {Math.ceil(totalEntries / 10)}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Tombol Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (page * 10 < totalEntries) setPage((p) => p + 1);
                        }}
                        href="#"
                        className={
                          page * 10 >= totalEntries
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
        </div>
      </main>
    </div>
  );
}
