"use client";

import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "~/store/authSlice";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function UserProfileSheet() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-3 pl-2 transition-colors focus:outline-none">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#C8102E] text-xs font-bold text-white shadow-xs">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              (user?.name?.charAt(0).toUpperCase() ?? "U")
            )}
          </div>
          <span className="hidden max-w-24 truncate font-['Quicksand'] text-sm font-medium sm:inline">
            {user?.name || "John Doe"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </SheetTrigger>

      {/* 💥 TETAP MENGGUNAKAN side="top" UNTUK ANIMASI DOWN, 
          NAMUN OVERRIDE POSISI KE POJOK KANAN ATAS */}
      <SheetContent
        side="top"
        className="!md:top-20 fixed !top-16 right-6 !left-auto flex flex-col items-start justify-start border border-[#1C65DA] bg-white p-6 font-['Quicksand'] shadow-md transition-all duration-500"
        style={{
          width: "361px",
          height: "200px",
          borderRadius: "8px",
        }}
      >
        {/* Konten Menu Vertikal Persis Screenshot */}
        <div className="flex w-full flex-col gap-5 text-left">
          <Link
            to="/user/profile"
            className="w-full text-[16px] font-bold text-[#0A0D12] transition-colors hover:text-[#1C65DA]"
          >
            Profile
          </Link>

          <Link
            to="/loans"
            className="w-full text-[16px] font-bold text-[#0A0D12] transition-colors hover:text-[#1C65DA]"
          >
            Borrowed List
          </Link>

          <Link
            to="/loans/history"
            className="w-full text-[16px] font-bold text-[#0A0D12] transition-colors hover:text-[#1C65DA]"
          >
            Reviews
          </Link>

          {/* Tombol Aksi Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer text-left text-[16px] font-bold text-[#F04438] transition-colors hover:text-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
