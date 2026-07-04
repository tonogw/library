import { cubicBezier, easeInOut, motion as m } from "framer-motion";
import heroBackdrop from "/images/hero-blue-bckgrnd.png";
import Girl from "/images/hero-girl.png";
import BOY from "/images/hero-boy.png";

export default function HeroSection() {
  // 1. Varian Animasi Pembungkus Utama Teks (Mengatur rentetan stagger anak)
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  // 2. Varian Teks Baris 1 - Menggunakan cubicBezier yang valid di TypeScript
  const textItemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.25, 1, 0.5, 1), // DIJAMIN SEMBUH TIDAK MERAH LAGI
      },
    },
  };

  // 3. Varian Teks Baris 2 - Disamakan agar transisinya rapi senada
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.2, 0.65, 0.3, 0.9),
      },
    },
  };

  // 4. Varian Animasi Melayang Karakter Perempuan (Infinity)
  const floatGirlVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      y: [0, -12, 0],
      rotate: [0, -4.5, -6.64],
      // rotate: [-6.64, -4.5, -6.64],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: easeInOut,
        },
        rotate: {
          duration: 4,
          repeat: Infinity,
          ease: easeInOut,
        },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
  };

  // 5. Varian Animasi Melayang Karakter Laki-Laki (Infinity + Stagger Delay)
  const floatBoyVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      y: [0, -15, 0],
      rotate: [0, 3, 0],
      transition: {
        y: {
          duration: 4.5,
          repeat: Infinity,
          ease: easeInOut,
          delay: 0.4,
        },
        rotate: {
          duration: 4.5,
          repeat: Infinity,
          ease: easeInOut,
          delay: 0.4,
        },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative mx-auto flex h-[504px] w-full max-w-[1440px] items-center justify-center overflow-hidden bg-[#FDFDFD] font-['Quicksand']"
      aria-label="hero-heading"
    >
      {/* BACKGROUND GRAPHIC & IMAGES FLANKING */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <img
          src={heroBackdrop}
          alt="hero picture illustration flanking text"
          className="h-full w-full max-w-300 object-contain"
        />

        {/* HARUS DIPASANG INITIAL DAN ANIMATE AGAR BERGERAK INFINITY */}
        <m.div
          variants={floatGirlVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <img src={Girl} alt="girl" className="absolute top-10 left-28 z-10" />
        </m.div>

        <m.div
          variants={floatBoyVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <img src={BOY} alt="boy" className="absolute top-10 right-30 z-10" />
        </m.div>
      </div>

      {/* CENTER ANIMATED TEXT CONTAINER (Frame 1618874000) */}
      <m.div
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
        className="pointer-events-none absolute z-10 flex h-[196px] w-[655.78px] flex-col items-center justify-center"
      >
        {/* Teks Baris 1: Welcome to */}
        <m.h1
          variants={textItemVariants}
          className="-mb-[10px] h-[103px] w-[655.78px] text-center text-[82.52px] leading-[103px] font-bold tracking-tight text-[#6597E8]"
          style={{
            WebkitTextStroke: "7.19px #FFFFFF",
            paintOrder: "stroke fill",
          }}
        >
          Welcome to
        </m.h1>

        {/* Teks Baris 2: Booky */}
        <m.h2
          variants={textVariants}
          className="h-[103px] w-[655.78px] text-center text-[82.52px] leading-[103px] font-bold tracking-tight text-[#6597E8]"
          style={{
            WebkitTextStroke: "7.19px #FFFFFF",
            paintOrder: "stroke fill",
          }}
        >
          Booky
        </m.h2>
      </m.div>
    </section>
  );
}
