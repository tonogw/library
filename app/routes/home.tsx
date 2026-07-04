// import { href } from "react-router";
// import { Button } from "~/components/ui/button";
import Navbar from "~/components/layout/navbar";
import HeroSection from "~/home/heroSection";
import RecommendBooks from "../home/recommendSection";
import Footer from "~/components/layout/footer";
import CategorySection from "~/home/categorySection";
import AuthorSection from "~/home/authorSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategorySection />
      <RecommendBooks />
      <AuthorSection />
      <Footer />
    </>
  );
}
