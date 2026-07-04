import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function BooksIndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Otomatis lempar user ke rute katalog utama yang sudah teruji
    navigate("/user/books", { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center font-quicksand text-gray-500">
      Redirecting to book catalog...
    </div>
  );
}
