import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router"; // React Router v7
import { useSelector } from "react-redux"; // Import untuk mengambil data dari Redux
import { selectCurrentUser } from "~/store/authSlice"; //Sesuaikan path menuju file Redux Auth milikmu
import { InputGroup } from "../ui/input-group";
import { Input } from "../ui/input";

export default function SearchBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Ambil data user yang sedang login dari Redux store
  const currentUser = useSelector(selectCurrentUser);

  // 2. Ambil role-nya secara aman (pastikan nama propertinya sesuai di types/UserData kamu, misal 'role')
  const currentUserRole = currentUser?.role || "user"; // Fallback ke "user" jika belum login / guest

  const currentSearch = searchParams.get("search") || "";
  const [keyword, setKeyword] = useState(currentSearch);

  // Sync ulang jika state search di URL berubah dari luar komponen
  useEffect(() => {
    setKeyword(currentSearch);
  }, [currentSearch]);

  const handleSearchTrigger = (value: string) => {
    const params = new URLSearchParams();

    if (value.trim()) {
      params.set("search", value);
      params.set("page", "1");
    }

    // 3. Tentukan rute berdasarkan role hasil deteksi Redux
    const targetPath =
      currentUserRole === "admin" ? "/admin/search-book" : "/search-book";

    navigate(`${targetPath}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchTrigger(keyword);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);

    if (val === "") {
      handleSearchTrigger("");
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <InputGroup className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
          <img src="/icons/Search.svg" alt="Search Icon" className="h-5 w-5" />
        </div>

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
