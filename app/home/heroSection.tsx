import heroBackdrop from "/images/hero-backdrop.png";
import Navbar from "~/components/layout/navbar";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="mx-auto h-156 max-w-360 items-center bg-[#FDFDFD]"
      aria-label="hero-heading"
    >
      <div className="">
        <img src={heroBackdrop} alt="hero picture" className="mx-auto pt-20" />
      </div>
    </section>
  );
}
