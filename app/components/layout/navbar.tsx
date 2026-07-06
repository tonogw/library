import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectIsAuthenticated } from "~/store/authSlice";
import { queryKeys } from "~/lib/query/keys";
import api from "~/lib/api/axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { UserProfileSheet } from "../shared/userProfileSheet";
import { Search } from "lucide-react";
import SearchBook from "../shared/searchBook-form";

export default function Navbar() {
  const queryClient = useQueryClient();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const meResponse = queryClient.getQueryData<any>(["currentUserRoleCheck"]);
  const userRole = meResponse?.data?.profile?.role;

  const { data: cartData } = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: async () => {
      const response = await api.get("/api/cart");
      return response.data;
    },
    enabled: isAuthenticated && mounted,
  });

  const totalItems = cartData?.data?.itemCount ?? 0;

  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-gray-100 bg-white shadow-sm shadow-gray-100">
      <div className="mx-auto flex h-20 max-w-300 items-center justify-between bg-white px-4! lg:px-0">
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
        {userRole === "ADMIN" && (
          <Link to="/admin/books" hidden>
            Admin Dashboard
          </Link>
        )}

        {/* SEARCH BAR */}
        <div className="hidden w-full max-w-360 lg:block">
          <SearchBook />
        </div>
        <div className="block lg:hidden">
          <Sheet open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-gray-50"
              >
                <img
                  src="/icons/Search.svg"
                  alt="search"
                  className="items-right lg:items-left justrify-left"
                />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-90">
              <SheetHeader className="mb-6">
                <SheetTitle>Search Catalogue</SheetTitle>
              </SheetHeader>
              <div className="mt-4 w-full">
                <SearchBook />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* RIGHT BLOK */}
        <div className="flex items-center gap-4">
          {/* User verification */}
          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/user/cart"
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
            // must logged in
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
