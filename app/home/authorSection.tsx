import { Link } from "react-router"; // Menggunakan React Router v7
import { authorData } from "~/constant/author-data"; // Asumsi file data disimpan di folder constant Bapak

export default function AuthorSection() {
  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-10 px-4">
      {/* 1. SECTION TITLE (Popular Authors) */}
      <h2 className="text-left text-[36px] leading-11 font-bold tracking-tight text-[#0A0D12]">
        Popular Authors
      </h2>

      {/* 2. GRID/FLEX ROW CONTAINER (Frame 1618874003) */}
      <div className="grid min-h-28.25 w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {authorData.map((author) => (
          <Link
            key={author.id}
            to={`/user/books?authorId=${author.id}`} // Mengarahkan ke filter buku berdasarkan penulis
            className="group lg:max-w- rounded-3 flex h-28.25 w-full flex-row items-center gap-4 bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.02]"
          >
            {/* Avatar Lingkaran (Ellipse 2 - 81px x 81px) */}
            <div className="h-20.25 w-20.25 shrink-0 overflow-hidden rounded-full border border-gray-50 bg-gray-100 shadow-sm">
              <img
                src={author.src}
                alt={author.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Meta Info Box (Frame 1618874002) */}
            <div className="flex min-w-0 grow flex-col items-start gap-0.5">
              {/* Nama Penulis */}
              <h3 className="w-full truncate text-left text-[18px] leading-8 font-bold tracking-[-0.03em] text-[#181D27]">
                {author.name}
              </h3>

              {/* Keterangan Jumlah Buku (Frame 1618874001) */}
              <div className="flex h-7.5 flex-row items-center gap-1.5">
                <img src="/icons/author-badge.svg" alt="badge" />
                {/* Icon Book Mini SVG dengan Warna Primer #1C65DA */}
                {/* <svg
                  className="h-5 w-5 shrink-0 text-[#1C65DA]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg> */}
                {/* Badge Label */}
                <span className="font-['Quicksand'] text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-[#0A0D12]">
                  {author.badge} books
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
