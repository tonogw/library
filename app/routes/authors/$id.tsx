import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";

interface AuthorType {
  id: number;
  name: string;
  bio: string | null;
  bookCount: number;
  accumulatedScore: number;
}

interface BookType {
  id: number;
  title: string;
  coverImage?: string;
  rating?: string | number;
  author?: {
    name: string;
  };
}

export default function AuthorBookListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: authorsResponse, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["popularAuthorsList"],
    queryFn: async () => {
      const res = await api.get("/api/authors/popular?limit=10");
      return res.data;
    },
  });

  const { data: booksResponse, isLoading: isLoadingBooks } = useQuery({
    queryKey: ["booksByAuthor", id],
    queryFn: async () => {
      const res = await api.get(`/api/books?authorId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const targetAuthorId = id ? Number(id) : 0;
  const authorList = (authorsResponse?.data?.authors || []) as AuthorType[];
  const currentAuthor = authorList.find(
    (auth: AuthorType) => auth.id === targetAuthorId,
  );
  const books = (booksResponse?.data?.books ||
    booksResponse?.data ||
    []) as BookType[];

  if (isLoadingAuthor || isLoadingBooks) {
    return (
      <div className="py-20 text-center font-['Quicksand'] text-lg text-gray-400">
        Loading author details and books...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-[#FDFDFD] font-['Quicksand']">
      {/* 1. BAGIAN ATAS & KONTEN UTAMA */}
      <div className="w-full">
        <Navbar />

        {/* Outer Container Utama untuk Konten Halaman (Footer dikeluarkan dari sini) */}
        <div className="mx-auto mt-14 mb-20 flex max-w-300 flex-col items-start gap-10 px-4 lg:px-0">
          {/* CARD AUTHORS - TOP PANEL */}
          <div
            className="flex w-full flex-row items-center gap-4 border border-gray-50 bg-[#FFFFFF] p-4"
            style={{
              height: "113px",
              boxShadow: "0px 0px 20px rgba(203, 202, 202, 0.25)",
              borderRadius: "16px",
            }}
          >
            <div
              className="flex-none rounded-full bg-[#F5F5F5] bg-cover bg-center"
              style={{
                width: "81px",
                height: "81px",
                backgroundImage: `url('/images/book-placeholder.png')`,
              }}
            />

            <div className="flex h-16 flex-none flex-col items-start gap-0.5">
              <h2 className="truncate text-[18px] leading-8 font-bold tracking-[-0.03em] text-[#181D27]">
                {currentAuthor?.name || "Unknown Author"}
              </h2>

              <div className="flex h-7.5 flex-none flex-row items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center text-[18px] text-[#1C65DA]">
                  📘
                </span>
                <span className="text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-[#0A0D12]">
                  {currentAuthor?.bookCount || books.length} books
                </span>
              </div>
            </div>
          </div>

          {/* BOOK LIST SECTION - GRID WRAPPER */}
          <div className="flex w-full flex-col items-start gap-8">
            <h2 className="text-[36px] leading-11 font-bold tracking-[-0.02em] text-[#0A0D12]">
              Book List
            </h2>

            {books.length === 0 ? (
              <div className="w-full rounded-xl border border-dashed py-10 text-center text-gray-400 italic">
                No books found published by this author in the library.
              </div>
            ) : (
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-5">
                {books.map((book: BookType) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="flex cursor-pointer flex-col items-start bg-[#FFFFFF] transition-transform hover:scale-[1.02]"
                    style={{
                      width: "224px",
                      height: "468px",
                      boxShadow: "0px 0px 20px rgba(203, 202, 202, 0.25)",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      src={book.coverImage || "/images/book-placeholder.png"}
                      alt={book.title}
                      className="h-84 w-56 object-cover"
                      style={{
                        borderRadius: "12px 12px 0px 0px",
                      }}
                    />

                    <div className="flex h-33 w-56 flex-col items-start gap-1 rounded-[0px_0px_12px_12px] p-4">
                      <h3 className="h-8 w-48 truncate text-[18px] leading-8 font-bold tracking-[-0.03em] text-[#181D27]">
                        {book.title}
                      </h3>

                      <p className="h-7.5 w-48 truncate text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-neutral-700">
                        {currentAuthor?.name ||
                          book.author?.name ||
                          "Unknown Author"}
                      </p>

                      <div className="flex h-7.5 w-48 flex-row items-center gap-1">
                        <span className="flex items-center text-[18px] text-[#FFAB0D]">
                          ★
                        </span>
                        <span className="text-[16px] leading-7.5 font-semibold tracking-[-0.02em] text-[#181D27]">
                          {book.rating || "4.9"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH (Diletakkan mandiri di luar induk flex agar layout horizontalnya aman) */}
      <div className="clear-both block w-full content-none">
        <Footer />
      </div>
    </div>
  );
}
