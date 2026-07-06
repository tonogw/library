import { Link } from "react-router";
export default function UserProfileTab() {
  return (
    <>
      {/* Outer Container Level - Frame 1618873981 */}
      <div className="mx-4 mt-14 mb-20 flex w-full max-w-139.25 flex-col items-start gap-6 px-4 md:px-0 lg:ml-55">
        {/* TOP TABS CONTROL (Tab Wrapper - 557px x 56px) */}
        <div
          className="flex w-full flex-row items-center gap-2 bg-[#F5F5F5] p-2"
          style={{ height: "56px", borderRadius: "16px" }}
        >
          {/* Active Tab: Profile */}
          <div
            className="order-0 flex flex-none grow-0 flex-row items-center justify-center gap-2 bg-[#FFFFFF] p-[8px_12px]"
            style={{
              width: "175px",
              height: "40px",
              boxShadow: "0px 0px 20px rgba(203, 202, 202, 0.25)",
              borderRadius: "12px",
            }}
          >
            <span className="text-[16px] leading-7.5 font-bold tracking-[-0.02em] text-[#0A0D12]">
              Profile
            </span>
          </div>

          {/* Inactive Tab: Borrowed List */}
          <Link
            to="/loans"
            className="order-1 flex flex-none grow-0 flex-row items-center justify-center gap-2 p-[8px_12px] hover:bg-white/50"
            style={{ width: "175px", height: "40px", borderRadius: "12px" }}
          >
            <span className="text-neutral-6 text-[16px] leading-7.5 font-medium tracking-[-0.03em]">
              Borrowed List
            </span>
          </Link>

          {/* Inactive Tab: Reviews */}
          <Link
            to="/loans/history"
            className="order-2 flex flex-none grow-0 flex-row items-center justify-center gap-2 p-[8px_12px] hover:bg-white/50"
            style={{ width: "175px", height: "40px", borderRadius: "12px" }}
          >
            <span className="text-[16px] leading-7.5 font-medium tracking-[-0.03em] text-neutral-600">
              Reviews
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
