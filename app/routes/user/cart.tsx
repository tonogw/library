import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkedCartItemIds, setCheckedCartItemIds] = useState<number[]>([]);

  // 1. Ambil data keranjang realtime dari server backend
  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["userCartItems"],
    queryFn: async () => {
      const res = await api.get("/api/cart"); // Menyesuaikan endpoint GET cart bawaan backend
      return res.data;
    },
  });

  // Ambil array list item dari database server
  const cartItems = cartResponse?.data?.items || cartResponse?.data || [];

  // 2. Mutasi untuk menghapus item dari keranjang belanja server
  const removeCartItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await api.delete(`/api/cart/items/${itemId}`);
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["userCartItems"] });
    },
    onError: () => {
      toast.error("Failed to remove item.");
    },
  });

  const handleCheckItem = (itemId: number) => {
    setCheckedCartItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectAll = () => {
    if (checkedCartItemIds.length === cartItems.length) {
      setCheckedCartItemIds([]);
    } else {
      setCheckedCartItemIds(cartItems.map((item: any) => item.id));
    }
  };

  const handleGoToCheckout = () => {
    if (checkedCartItemIds.length === 0) return;
    // Filter item yang dicentang user untuk dikirim ke halaman checkout
    const selectedItems = cartItems.filter((item: any) =>
      checkedCartItemIds.includes(item.id),
    );
    navigate("/user/checkout", { state: { selectedItems } });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-quicksand text-lg text-gray-400">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] pb-20 font-['Quicksand']">
      <Navbar />
      <div className="mx-auto mt-8 flex max-w-[1000px] flex-col gap-[32px] px-4">
        <h1 className="text-[36px] leading-[44px] font-bold text-[#0A0D12]">
          My Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-lg text-gray-400">
            Your cart is empty.{" "}
            <Link to="/" className="text-[#1C65DA] underline">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row">
            {/* LEFT CONTAINER: ITEMS FROM FIGMA EXTRACTED CSS (642px) */}
            <div className="flex w-full flex-col gap-6 lg:w-[642px]">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={
                    cartItems.length > 0 &&
                    checkedCartItemIds.length === cartItems.length
                  }
                  onChange={handleSelectAll}
                  className="h-5 w-5 cursor-pointer rounded-[6px] border-[#A4A7AE] accent-[#1C65DA]"
                />
                <span className="text-[16px] font-semibold text-[#0A0D12]">
                  Select All
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {cartItems.map((item: any) => {
                  const bookInfo = item.book || {};
                  return (
                    <div key={item.id} className="flex flex-col gap-4">
                      <div className="flex h-[138px] w-full flex-row items-start gap-4">
                        <input
                          type="checkbox"
                          checked={checkedCartItemIds.includes(item.id)}
                          onChange={() => handleCheckItem(item.id)}
                          className="mt-2 h-5 w-5 cursor-pointer accent-[#1C65DA]"
                        />
                        <img
                          src={
                            bookInfo.coverImage ||
                            "/images/book-placeholder.png"
                          }
                          alt={bookInfo.title}
                          className="h-[138px] w-[92px] rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex flex-col justify-start gap-1">
                          <div className="w-fit rounded-[6px] border border-[#D5D7DA] bg-white px-2 text-[14px] font-bold text-[#0A0D12]">
                            {bookInfo.category?.name || "Category"}
                          </div>
                          <h3 className="max-w-[300px] truncate text-[18px] leading-[32px] font-bold tracking-tight text-[#0A0D12]">
                            {bookInfo.title}
                          </h3>
                          <p className="text-[16px] font-medium text-[#414651]">
                            {bookInfo.author?.name || "Unknown Author"}
                          </p>
                          <button
                            onClick={() =>
                              removeCartItemMutation.mutate(item.id)
                            }
                            className="mt-1 w-fit text-left text-sm font-semibold text-red-500 hover:underline"
                          >
                            {removeCartItemMutation.isPending
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                      <hr className="w-full border-[#D5D7DA]" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONTAINER: LOAN SUMMARY CARD (318px) */}
            <div className="flex w-full flex-col gap-6 rounded-[16px] border border-gray-50 bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:w-[318px]">
              <h2 className="text-[20px] font-bold text-[#0A0D12]">
                Loan Summary
              </h2>
              <div className="flex items-center justify-between text-[16px]">
                <span className="font-medium text-[#0A0D12]">Total Book</span>
                <span className="font-bold text-[#0A0D12]">
                  {checkedCartItemIds.length} Items
                </span>
              </div>
              <button
                onClick={handleGoToCheckout}
                disabled={checkedCartItemIds.length === 0}
                className="h-[48px] w-full rounded-full bg-[#1C65DA] text-[16px] font-bold text-white transition-colors hover:bg-[#154eb3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Borrow Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
