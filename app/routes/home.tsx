import { href } from "react-router";
import { Button } from "~/components/ui/button";
import Navbar from "~/components/layout/navbar";
import HeroSection from "~/home/heroSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  );
}
