// import { href } from "react-router";
// import { Button } from "~/components/ui/button";
import Navbar from "~/components/layout/navbar";
import HeroSection from "~/home/heroSection";
import RecommendBooks from "./books/recommend";
import Footer from "~/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RecommendBooks />
      <Footer />
    </>
  );
}
