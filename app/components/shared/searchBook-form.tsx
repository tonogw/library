import { useQuery } from "@tanstack/react-query";
import { InputGroup } from "../ui/input-group";
import { Input } from "../ui/input";
import { useState } from "react";
import { queryKeys } from "~/lib/query/keys";
import api from "~/lib/api/axios";

export default function SearchBook() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminBooks({ search, status, page }),
    queryFn: async () => {
      const res = await api.get("/api/admin/books", {
        params: {
          status,
          q: search || undefined,
          page,
          limit: 20,
        },
      });
      return res.data;
    },
  });

  const bookList = data?.data?.books || [];
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
    <div className="relative w-full max-w-md">
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
  );
}
