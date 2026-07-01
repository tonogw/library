import heroBackdrop from '/images/hero-backdrop.png';
import Navbar from '~/components/layout/navbar';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="mx-auto h-156 max-w-360 bg-gray-300"
      aria-label="hero-heading"
    >
      <div className="custom-container">
        <img src={heroBackdrop} alt="hero picture" className="pt-32" />
      </div>
    </section>
  );
}
