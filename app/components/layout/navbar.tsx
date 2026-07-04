import { useState, useEffect } from "react"; // 1. Tambahkan useEffect
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { selectIsAuthenticated } from "~/store/authSlice";
import { queryKeys } from "~/lib/query/keys";
import api from "~/lib/api/axios";
import { Input } from "../ui/input";
import { UserProfileSheet } from "../shared/userProfileSheet";
import { Search } from "lucide-react";
import SearchBook from "../shared/searchBook-form";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false); // 2. State untuk melacak mounting browser
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 3. Set mounted menjadi true setelah masuk ke browser client
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: cartData } = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: async () => {
      const response = await api.get("/api/cart");
      return response.data;
    },
    enabled: isAuthenticated && mounted, // Hanya ambil data jika sudah mounted
  });

  const totalItems = cartData?.summary?.totalItems ?? 0;

  // const handleSearchTrigger = (value: string) => {
  //   const params = new URLSearchParams();

  //   if (value.trim()) {
  //     params.set("search", value);
  //     params.set("page", "1");
  //   }
  //   navigate(`/search-book?${params.toString()}`);
  // };

  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between bg-white px-6 lg:px-[120px]">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-[11.79px]">
          <img
            src="/icons/Logo.svg"
            alt="Booky"
            className="h-12 w-12 object-contain"
          />
          <span className="font-['Quicksand'] text-[25.14px] font-bold text-[#0A0D12]">
            Booky
          </span>
        </Link>

        {/* SEARCH BAR */}
        <div className="relative mx-4 hidden w-full max-w-[400px] sm:block">
          <SearchBook />
          {/* <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="search-bar"
            type="text"
            placeholder="Search book"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-14 h-10 rounded-full border border-gray-200 bg-white pr-4 pl-11 font-['Quicksand'] focus-visible:ring-gray-300"
          /> */}
        </div>

        {/* CONTROLS (KANAN) */}
        <div className="flex items-center gap-4">
          {/* 4. Bungkus pengecekan auth dengan kondisi mounted */}
          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 p-2 transition-transform hover:scale-105"
              >
                <img
                  src="/icons/Bag.svg"
                  alt="Cart"
                  className="h-6 w-6 object-contain"
                />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EE1D52] text-[11px] font-bold text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              <UserProfileSheet />
            </div>
          ) : (
            // Jika belum selesai loading mounted di client, tampilkan tombol sign in default agar server & client sinkron
            <Link
              to="/login"
              className="rounded-full border border-[#0A0D12] px-5 py-2 font-['Quicksand'] text-sm font-bold text-[#0A0D12] hover:bg-gray-50"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
