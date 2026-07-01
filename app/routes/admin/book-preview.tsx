import { useParams, useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import api from "~/lib/api/axios"
import Navbar from "~/components/layout/navbar"
import { Star, ArrowLeft, LucideShare2, Share2, Share2Icon } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function AdminBookPreview() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetching detail data buku berdasarkan ID rute
  const { data, isLoading } = useQuery({
    queryKey: ["bookPreview", id],
    queryFn: async () => {
      const response = await api.get(`/api/books/${id}`) // Sesuaikan dengan endpoint detail buku Anda
      return response.data
    },
    enabled: !!id,
  })

  const book = data?.data || {}

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white font-['Quicksand']">
        <div className="text-16 animate-pulse font-bold text-gray-400">
          Loading preview metadata...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white pb-20 font-['Quicksand']">
      {/* HEADER NAVBAR INTERGRATION */}
      <Navbar />

      {/* MAIN CONTAINER: Frame 1618874015 */}
      <div className="mx-auto mt-32 flex max-w-[1200px] flex-col gap-8 px-6 lg:px-0">
        {/* HEADER TITLE BAR: Frame 1618874014 */}
        <div className="flex h-[38px] flex-row items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-8 w-8 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-[#0A0D12]" />
          </Button>

          <h1 className="text-28 m-0 font-bold tracking-tight text-[#0A0D12]">
            Preview Book
          </h1>
        </div>

        {/* CONTENT HOLDER: Frame 102 -> Frame 19 */}
        <div className="flex min-h-[498px] w-full flex-col items-stretch gap-9 lg:flex-row">
          {/* SISI KIRI: Frame 7 (Container Cover Image) */}
          <div className="flex min-h-[498px] w-full flex-none items-center justify-center rounded-2xl bg-[#E9EAEB] p-2 lg:w-[337px]">
            <img
              src={book.coverImage || "/images/coverBook-psychologyOfMoney.png"}
              alt={book.title}
              className="h-[482px] w-full max-w-[321px] rounded-xl object-cover shadow-xs"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                if (target.src !== "/images/coverBook-psychologyOfMoney.png") {
                  target.src = "/images/coverBook-psychologyOfMoney.png"
                }
              }}
            />
          </div>

          {/* SISI KANAN: Frame 16 (Detail & Stats Info) */}
          <div className="flex flex-grow flex-col items-start justify-between gap-5 py-2">
            {/* TOP GROUP: Frame 15 */}
            <div className="flex w-full flex-col items-start gap-[22px]">
              {/* META INFO: Frame 12 */}
              <div className="flex w-full flex-col items-start gap-1">
                {/* Category Tag: Frame 13 */}
                <div className="box-sizing flex h-7 items-center justify-center rounded-md border border-[#D5D7DA] bg-white px-2">
                  <span className="text-14 font-bold tracking-tight text-[#0A0D12]">
                    {book.category?.name || "Business & Economics"}
                  </span>
                </div>
                {/* Title */}
                <h2 className="text-28 m-0 mt-2 font-bold tracking-tight text-[#0A0D12]">
                  {book.title || "The Psychology of Money"}
                </h2>
                {/* Author */}
                <p className="text-16 m-0 font-semibold tracking-tight text-[#414651]">
                  {book.author?.name || "Morgan Housel"}
                </p>
                {/* Rating Badge: Frame 3 */}
                <div className="mt-1 flex h-[30px] items-center gap-0.5">
                  <Star className="h-6 w-6 fill-[#FFAB0D] text-[#FFAB0D]" />
                  <span className="text-16 pl-1 font-bold tracking-tight text-[#181D27]">
                    {book.rating || "4.9"}
                  </span>
                </div>
              </div>

              {/* STATS COUNT GRID: Frame 11 */}
              <div className="flex w-full flex-row items-center gap-5 border-t border-b border-gray-100 py-4">
                {/* Pages: Frame 8 */}
                <div className="flex w-[102px] flex-col items-start">
                  <span className="text-24 font-bold text-[#0A0D12]">
                    {book.publishedYear || "320"}
                  </span>
                  <span className="text-16 font-medium tracking-tight text-[#0A0D12]">
                    Page
                  </span>
                </div>
                {/* Divider Line 1 */}
                <div className="h-[44px] w-[1px] bg-[#D5D7DA]" />

                {/* Rating Counter: Frame 9 */}
                <div className="flex w-[102px] flex-col items-start">
                  <span className="text-24 font-bold text-[#0A0D12]">
                    {book.reviewCount || "212"}
                  </span>
                  <span className="text-16 font-medium tracking-tight text-[#0A0D12]">
                    Rating
                  </span>
                </div>
                {/* Divider Line 2 */}
                <div className="h-[44px] w-[1px] bg-[#D5D7DA]" />

                {/* Reviews Counter: Frame 10 */}
                <div className="flex w-[102px] flex-col items-start">
                  <span className="text-24 font-bold text-[#0A0D12]">
                    {book.borrowCount || "179"}
                  </span>
                  <span className="text-16 font-medium tracking-tight text-[#0A0D12]">
                    Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION BOX: Frame 14 */}
            <div className="flex w-full max-w-[827px] flex-col items-start gap-1">
              <h3 className="text-20 m-0 font-bold tracking-tight text-[#0A0D12]">
                Description
              </h3>
              <p className="text-16 m-0 text-justify leading-[30px] font-medium tracking-tight text-[#0A0D12]">
                {book.description ||
                  "The Psychology of Money explores how emotions, biases, and human behavior shape the way we think about money, investing, and financial decisions. Morgan Housel shares timeless lessons on wealth, greed, and happiness, showing that financial success is not about knowledge, but about behavior."}
              </p>
            </div>

            {/* ACTION BUTTON SYSTEM: Frame 97 */}
            <div className="mt-4 flex w-full max-w-[412px] flex-row items-center gap-3">
              <Button variant="secondary">Add to cart</Button>
              <Button>Borrow Book</Button>
              <Button variant="secondary">
                Share
                <Share2 />
                {/* <img src="/icons/icon-share.svg" alt="share" /> */}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
