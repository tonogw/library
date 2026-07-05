import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Tangkap data ID dari keranjang
  const rawState = location.state || {};
  const selectedItems = rawState.selectedItems || [];
  const directItemIds = rawState.itemIds || [];

  let itemIds: number[] = [];
  if (directItemIds.length > 0) {
    itemIds = directItemIds.map((id: any) => Number(id));
  } else if (selectedItems.length > 0) {
    itemIds = selectedItems.map((item: any) => Number(item.id));
  }

  const [borrowDuration, setBorrowDuration] = useState<number>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [returnDateStr, setReturnDateStr] = useState("");

  // State baru untuk mengontrol tampilan sukses Figma
  const [isSuccess, setIsSuccess] = useState(false);

  // Ambil Data Profil User
  const { data: meResponse } = useQuery({
    queryKey: ["checkoutUserProfile"],
    queryFn: async () => {
      const res = await api.get("/api/me");
      return res.data;
    },
  });

  const userProfile = meResponse?.data?.profile;

  // Realtime kalkulasi tanggal pengembalian
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + borrowDuration);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setReturnDateStr(today.toLocaleDateString("en-US", options));
  }, [borrowDuration]);

  if (itemIds.length === 0 && selectedItems.length === 0 && !isSuccess) {
    return (
      <div className="py-20 text-center font-quicksand text-gray-400">
        No books selected.{" "}
        <button
          onClick={() => navigate("/user/cart")}
          className="text-blue-500 underline"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  // ==================================================================
  // RENDER TAMPILAN SUKSES SESUAI EXTRACTED FIGMA CSS
  // ==================================================================
  if (isSuccess) {
    return (
      <div className="relative min-h-screen w-full bg-[#FDFDFD] font-['Quicksand']">
        <Navbar />

        {/* Frame 1618873980 */}
        <div className="absolute top-[260px] left-[calc(50%-638px/2)] flex h-[332.38px] w-[638px] flex-col items-center gap-[32px]">
          {/* Frame 1618873979 (Lingkaran Luar) */}
          <div className="box-sizing-border-box flex h-[142.38px] w-[142.38px] flex-row items-center justify-center gap-[6.34px] rounded-[79.26px] border-[0.79px] border-[#E9EAEB] p-[6.34px]">
            {/* Frame 1618873978 (Lingkaran Tengah) */}
            <div className="box-sizing-border-box flex h-[129.69px] w-[129.69px] flex-row items-center justify-center gap-[6.34px] rounded-[792.62px] border-[0.79px] border-[#E9EAEB] p-[6.34px]">
              {/* Frame 1618873977 (Lingkaran Dalam Berwarna Biru) */}
              <div className="box-sizing-border-box relative flex h-[117.01px] w-[117.01px] flex-row items-center justify-center rounded-[79.26px] bg-[#1C65DA] shadow-md">
                {/* Check Icon Centang Putih Tebal */}
                <svg
                  className="h-[50.64px] w-[50.64px] text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Frame 129 */}
          <div className="flex h-[78px] w-[638px] flex-col items-center gap-[8px]">
            {/* Borrowing Successful! */}
            <h1 className="Bill-height-[38px] h-[38px] w-[638px] text-center text-[28px] font-bold tracking-[-0.02em] text-[#0A0D12]">
              Borrowing Successful!
            </h1>
            {/* Subtitle Deskripsi Tanggal */}
            <p className="line-height-[32px] h-[32px] w-[638px] text-center text-[18px] font-semibold tracking-[-0.02em] text-[#414651]">
              Your book has been successfully borrowed. Please return it by{" "}
              <strong className="text-red-500">{returnDateStr}</strong>
            </p>
          </div>

          {/* Button Redirect Figma */}
          <button
            type="button"
            onClick={() => navigate("/loans")}
            className="flex h-[48px] w-[286px] cursor-pointer flex-row items-center justify-center gap-[8px] rounded-[100px] bg-[#1C65DA] p-[8px] shadow-md transition-colors hover:bg-[#154eb3]"
          >
            <span className="line-height-[30px] flex h-[30px] w-[136px] items-center justify-center text-center text-[16px] font-bold tracking-[-0.02em] text-[#FDFDFD]">
              Check My Loans
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Default Form Checkout (Layout Tidak Berubah)
  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] pb-20 font-['Quicksand']">
      <Navbar />
      <div className="mx-auto mt-8 flex max-w-[1002px] flex-col gap-8 px-4">
        <h1 className="text-[36px] font-bold text-[#0A0D12]">Checkout</h1>

        <div className="grid w-full grid-cols-1 items-start gap-[58px] lg:grid-cols-2">
          {/* LEFT: USER & BOOK INFO */}
          <div className="flex w-full max-w-[466px] flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-[24px] font-bold text-[#0A0D12]">
                User Information
              </h2>
              <div className="flex flex-col gap-3 text-[16px]">
                <div className="flex justify-between">
                  <span className="font-medium text-[#0A0D12]">Name</span>
                  <span className="font-bold text-[#0A0D12]">
                    {userProfile?.name || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#0A0D12]">Email</span>
                  <span className="font-bold text-[#0A0D12]">
                    {userProfile?.email || "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#0A0D12]">
                    Nomor Handphone
                  </span>
                  <span className="font-bold text-[#0A0D12]">
                    {userProfile?.phone || "Loading..."}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-[#D5D7DA]" />

            <div className="flex flex-col gap-4">
              <h2 className="text-[24px] font-bold text-[#0A0D12]">
                Book List
              </h2>
              <div className="flex flex-col gap-4">
                {selectedItems.map((item: any) => {
                  const b = item.book || {};
                  return (
                    <div
                      key={item.id}
                      className="flex h-[138px] flex-row items-center gap-4"
                    >
                      <img
                        src={b.coverImage || "/images/book-placeholder.png"}
                        alt={b.title}
                        className="h-[138px] w-[92px] rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="w-fit rounded-[6px] border border-[#D5D7DA] bg-white px-2 text-[14px] font-bold text-[#0A0D12]">
                          {b.category?.name || "Category"}
                        </span>
                        <h3 className="max-w-[280px] truncate text-[20px] font-bold text-[#0A0D12]">
                          {b.title}
                        </h3>
                        <p className="text-[16px] font-medium text-[#414651]">
                          {b.author?.name || "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: FORM BORROW REQUEST */}
          <div className="flex w-full max-w-[478px] flex-col gap-6 rounded-[20px] border border-gray-50 bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
            <h2 className="text-[28px] font-bold text-[#0A0D12]">
              Complete Your Borrow Request
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-[#0A0D12]">
                Borrow Date
              </label>
              <div className="flex h-[48px] items-center justify-between rounded-[12px] border border-[#D5D7DA] bg-[#F5F5F5] p-3">
                <span className="text-[16px] font-semibold text-[#0A0D12]">
                  {new Date().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>📅</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[16px] font-bold text-[#0A0D12]">
                Borrow Duration
              </span>
              <div className="flex flex-col gap-3">
                {[3, 5, 10].map((days) => (
                  <label
                    key={days}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={borrowDuration === days}
                      onChange={() => setBorrowDuration(days)}
                      className="h-5 w-5 accent-[#1C65DA]"
                    />
                    <span className="text-[16px] font-semibold text-[#0A0D12]">
                      {days} Days
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-[#F6F9FE] p-4">
              <span className="text-[14px] font-bold text-[#0A0D12]">
                Return Date
              </span>
              <p className="text-[14px] font-medium text-[#0A0D12]">
                Please return the book no later than{" "}
                <strong className="text-red-500">{returnDateStr}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-3 text-[14px]">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeReturn}
                  onChange={(e) => setAgreeReturn(e.target.checked)}
                  className="mt-1 accent-[#1C65DA]"
                />
                <span className="font-semibold text-[#0A0D12]">
                  I agree to return the book(s) before the due date.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="mt-1 accent-[#1C65DA]"
                />
                <span className="font-semibold text-[#0A0D12]">
                  I accept the library borrowing policy.
                </span>
              </label>
            </div>

            <button
              type="button"
              disabled={!agreeReturn || !agreePolicy}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                try {
                  const today = new Date();
                  const yyyy = today.getFullYear();
                  const mm = String(today.getMonth() + 1).padStart(2, "0");
                  const dd = String(today.getDate()).padStart(2, "0");
                  const formattedDate = `${yyyy}-${mm}-${dd}`;

                  const res = await api.post("/api/loans/from-cart", {
                    itemIds: itemIds,
                    days: borrowDuration,
                    borrowDate: formattedDate,
                  });

                  if (
                    res.data?.success ||
                    res.status === 200 ||
                    res.status === 201
                  ) {
                    // Refresh angka navbar secara global
                    queryClient.invalidateQueries({
                      queryKey: ["userCartItems"],
                    });
                    // Pemicu perpindahan ke view sukses Figma
                    setIsSuccess(true);
                  }
                } catch (error: any) {
                  alert(
                    error.response?.data?.message ||
                      "Confirmed failed, stock empty on server",
                  );
                }
              }}
              className="h-[48px] w-full cursor-pointer rounded-full bg-[#1C65DA] text-[16px] font-bold text-white transition-colors hover:bg-[#154eb3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              confirm and Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
