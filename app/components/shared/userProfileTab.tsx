import { Link } from "react-router";

export default function UserProfileTab() {
  return (
    <>
      {/* Outer Container Level - Frame 1618873981 */}
      <div className="mx-4 mt-14 mb-20 flex w-full max-w-90.25 flex-col items-start gap-6 px-4 md:max-w-139.25 md:px-0 lg:ml-55">
        {/* TOP TABS CONTROL (Tab Wrapper - w-full dengan isi 3 elemen x 109px/175px) */}
        <div
          className="flex w-full items-center justify-between gap-1 bg-[#F5F5F5] p-2 md:gap-2"
          style={{ height: "56px", borderRadius: "16px" }}
        >
          {/* Active Tab: Profile */}
          <div
            className="flex h-10 w-27.25 items-center justify-center bg-[#FFFFFF] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:w-43.75"
            style={{ borderRadius: "12px" }}
          >
            <Link
              to="/user/profile"
              className="flex h-full w-full items-center justify-center rounded-[12px] hover:bg-white/50"
            >
              <span className="text-[14px] leading-none font-bold tracking-[-0.02em] text-[#0A0D12] md:text-[16px]">
                Profile
              </span>
            </Link>
          </div>

          {/* Inactive Tab: Borrowed List */}
          <Link
            to="/loans"
            className="flex h-10 w-27.25 items-center justify-center rounded-[12px] bg-transparent text-center hover:bg-white/50 md:w-[175px]"
          >
            <span className="truncate px-1 text-[14px] leading-none font-medium tracking-[-0.03em] text-neutral-600 md:text-[16px]">
              Borrowed List
            </span>
          </Link>

          {/* Inactive Tab: Reviews */}
          <Link
            to="/loans/history"
            className="flex h-10 w-27.25 items-center justify-center rounded-[12px] bg-transparent text-center hover:bg-white/50 md:w-[175px]"
          >
            <span className="text-[14px] leading-none font-medium tracking-[-0.03em] text-neutral-600 md:text-[16px]">
              Reviews
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
