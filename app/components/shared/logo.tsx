export default function Logo() {
  return (
    <div className="flex flex-row items-center gap-[11.79px]">
      <div className="relative flex h-33 w-33 items-center justify-center rounded bg-[#1C65DA]">
        <img src="/icons/Logo.svg" alt="logo" sizes="42" />
        <span className="text-lg font-bold text-white">B</span>
      </div>
      <span className="text-[25.14px] leading-33 font-bold text-[#0A0D12]">
        Booky
      </span>
    </div>
  )
}
