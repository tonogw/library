// src/components/shared/UserProfileSheet.tsx
"use client"

import { Link, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { logOut, selectCurrentUser } from "~/store/authSlice"
import { User, MapPin, KeyRound, LogOut, ChevronDown } from "lucide-react"
// import { useAuthStore } from "../../store/useAuthStore"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"

// interface UserProfileSheetProps {
//   themeClass: string
// }

export function UserProfileSheet() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logOut())
    navigate("/login")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C8102E] text-xs font-bold text-white shadow-xs">
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
          <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
            {user?.name}
          </span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="font-nunito flex w-full flex-col justify-between sm:max-w-md"
      >
        <div className="space-y-6">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-3 text-xl font-extrabold">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8102E] text-sm font-black text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-base leading-tight text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs font-normal text-gray-400">
                  {user?.email}
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-2">
            <Link
              to="/borrow"
              className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <User className="h-4 w-4 text-gray-400" /> Riwayat Pesanan
            </Link>
            <Link
              to="/profile/address"
              className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 text-gray-400" /> Manajemen Alamat
            </Link>
            <Link
              to="/profile/security"
              className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <KeyRound className="h-4 w-4 text-gray-400" /> Keamanan & Sandi
            </Link>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" /> Keluar dari Sesi
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
