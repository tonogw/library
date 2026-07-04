import { Link } from "react-router"; // Menggunakan React Router v7
import { categoryData } from "~/constant/category-data";

export default function CategorySection() {
  return (
    <div className="mx-auto w-full max-w-300">
      {/* Wrapper Baris Utama (Frame 18 - Gap: 16px, Tinggi: 130px) */}
      <div className="no-scrollbar flex h-32.5 w-full flex-row items-center justify-between gap-4 overflow-x-auto py-2">
        {categoryData.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="group flex h-32.5 w-[186.67px] shrink-0 flex-col items-start justify-center gap-3 rounded-2xl bg-white p-3 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition-transform hover:scale-[1.03]"
          >
            {/* Box Kontainer Ikon Atas (Frame 17 - Bg: #E0ECFF, Tinggi: 64px, Lebar: 162.67px) */}
            <div className="flex h-16 w-[162.67px] flex-row items-center justify-center gap-[6.4px] rounded-[12px] bg-[#E0ECFF] p-[6.4px] transition-colors group-hover:bg-[#d0e2ff]">
              <img
                src={item.src}
                alt={item.alt}
                className="h-[51.2px] w-[51.2px] object-contain"
              />
            </div>

            {/* Label Teks Bawah (Fiction / Nama Kategori - Tinggi: 30px, Font: Quicksand 16px) */}
            <span className="h-[30px] w-[162.67px] truncate pl-1 text-left font-['Quicksand'] text-[16px] leading-[30px] font-semibold tracking-[-0.02em] text-[#0A0D12]">
              {item.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
