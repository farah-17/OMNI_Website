import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import omniHero from "@/assets/omni-hero.png";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show:   { opacity: 1, scale: 1, transition: { duration: 1.3, ease: EASE } },
};

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY  = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade   = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col px-6 overflow-hidden"
    >
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(217 100% 55% / 0.09) 0%, transparent 65%)" }}
          animate={{ scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[58%] top-[30%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 100% 60% / 0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center flex-1 pt-24 md:pt-28 pb-8 md:pb-10">

        {/* Text block */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ y: textY, opacity: fade }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* OMNI wordmark */}
          <motion.h1
            variants={scaleIn}
            className="font-heading font-bold tracking-wider text-gradient leading-none select-none mb-5"
            style={{ fontSize: "clamp(4.5rem, 17vw, 11rem)" }}
          >
            OMNI
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-foreground/75 text-xl md:text-2xl font-body font-light mb-3"
          >
            One device. Infinite control.
          </motion.p>

          {/* Sub-tagline */}
          <motion.p
            variants={fadeIn}
            className="text-muted-foreground/45 text-sm max-w-xs mx-auto font-body leading-relaxed mb-10"
          >
            Mechanical switches · OLED display<br />Rotary encoders · Voice control
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex gap-3 justify-center flex-wrap w-full px-2">
            <Link to="/store">
              <button className="btn-glass-primary px-8 py-3.5 text-sm">Shop Now</button>
            </Link>
            <Link to="/lineup">
              <button className="btn-glass px-8 py-3.5 text-sm">See the Lineup</button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero image — clickable, links to /store#configure */}
        <motion.div
          className="relative z-10 mt-8 md:mt-12 w-full max-w-xs sm:max-w-lg md:max-w-3xl mx-auto"
          style={{ y: imageY, opacity: fade }}
          initial={{ opacity: 0, y: 60, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.95, duration: 1.5, ease: EASE }}
        >
          <Link to="/store#configure" className="group block relative cursor-pointer">
            {/* Glow under image */}
            <div
              className="absolute inset-x-12 bottom-0 h-28 rounded-full blur-3xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"
              style={{ background: "hsl(217 100% 55% / 0.6)" }}
            />

            {/* Image */}
            <img
              src={omniHero}
              alt="OMNI Device — click to build yours"
            fetchPriority="high"
              className="relative w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Hover label — appears on hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            >
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/40 text-primary font-heading text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_hsl(217_100%_55%/0.2)]">
                Build Your OMNI
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/30 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-heading tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
