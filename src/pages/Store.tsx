import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import MouseSpotlight from "@/components/MouseSpotlight";
import FooterSection from "@/components/FooterSection";
import ColorShowcase from "@/components/store/ColorShowcase";
import CloserLook from "@/components/store/CloserLook";
import { Check, ShoppingCart, ChevronDown, Plus, ShieldCheck, Zap } from "lucide-react";
import { useCart } from "@/lib/context";
import { toast } from "sonner";

// All chassis+keycap combination images
import SilverWhite from "@/assets/Silver_White.png";
import SilverBlack from "@/assets/silver_black.png";
import SilverBlue from "@/assets/Silver_blue.png";
import SilverPurple from "@/assets/Silver_Purple.png";
import MatteeWhite from "@/assets/Matte_White.png";
import MatteeBlack from "@/assets/Matte_Black.png";
import MatteeBlue from "@/assets/Matte_Blue.png";
import MatteePurple from "@/assets/Matte_Purple.png";
import MidnightWhite from "@/assets/Midnight_White.png";
import MidnightBlue from "@/assets/Midnight_Blue.png";
import MidnightPurple from "@/assets/Midnight_Purple.png";
import MidnightBlueBlack from "@/assets/MidnightBlue_Black.png";
import PurpleWhite from "@/assets/Purple_White.png";
import PurpleBlack from "@/assets/Purple_Black.png";
import PurpleBlue from "@/assets/Purple_Blue.png";
import PurplePurple from "@/assets/Purple_Purple.png";

// Map of chassis+keycap -> image
const COMBO_IMAGES: Record<string, string> = {
  "silver-white":   SilverWhite,
  "silver-black":   SilverBlack,
  "silver-blue":    SilverBlue,
  "silver-purple":  SilverPurple,
  "stealth-white":  MatteeWhite,
  "stealth-black":  MatteeBlack,
  "stealth-blue":   MatteeBlue,
  "stealth-purple": MatteePurple,
  "midnight-white": MidnightWhite,
  "midnight-blue":  MidnightBlue,
  "midnight-black": MidnightBlueBlack,
  "midnight-purple":MidnightPurple,
  "purple-white":   PurpleWhite,
  "purple-black":   PurpleBlack,
  "purple-blue":    PurpleBlue,
  "purple-purple":  PurplePurple,
};

// Default preview image per chassis
const CHASSIS_DEFAULT: Record<string, string> = {
  silver:   SilverWhite,
  stealth:  MatteeBlack,
  midnight: MidnightBlue,
  purple:   PurpleBlack,
};
import closeupUsbc from "@/assets/closeup-usbc.jpeg";
import closeupOled from "@/assets/closeup-oled.jpeg";
import closeupMic from "@/assets/closeup-mic.jpeg";
import closeupKeycaps from "@/assets/closeup-keycaps.jpeg";
import closeupEncoders from "@/assets/closeup-encoders.jpeg";

/* ─── Color options ─── */
const colorOptions = [
  { id: "silver",   label: "Brushed Aluminum", color: "#9CA3AF", image: SilverWhite },
  { id: "stealth",  label: "Stealth Matte",    color: "#1F2937", image: MatteeBlack },
  { id: "midnight", label: "Midnight Blue",    color: "#1E3A5F", image: MidnightBlue },
  { id: "purple",   label: "Royal Purple",     color: "#4C1D95", image: PurpleBlack },
];

/* ─── Closer look items ─── */
const closerLookItems = [
  {
    id: "keycaps",
    label: "Mechanical Switches",
    image: closeupKeycaps,
    title: "Cherry MX-style hot-swap switches.",
    description:
      "Custom mechanical switches with a satisfying tactile bump. Hot-swappable for easy customization — swap stems, springs, and housings to match your feel.",
    details: [
      "Hot-swap PCB for tool-less switch replacement",
      "Cherry MX compatible stem for universal keycap support",
      "Factory-lubed stabilizers for zero rattle",
      "Gold-plated contact points for 50M+ keystroke lifespan"
    ]
  },
  {
    id: "oled",
    label: "OLED Display",
    image: closeupOled,
    title: "A tiny screen that says a lot.",
    description:
      "A high-contrast 128×64 OLED right on the device shows your current layer, mode, and custom graphics. Cycle through presets or monitor system stats.",
    details: [
      "High-contrast 0.96\" Monochrome OLED",
      "Real-time layer and macro feedback",
      "Customizable pixel art and system monitoring",
      "Ultra-low latency SPI communication"
    ]
  },
  {
    id: "encoders",
    label: "Rotary Encoders",
    image: closeupEncoders,
    title: "Precision at your fingertips.",
    description:
      "Two CNC-machined aluminum knobs with diamond knurling for precise control. Volume, zoom, scroll, brush size — assign them to anything.",
    details: [
      "CNC-machined 6061 Aluminum construction",
      "Diamond-knurled texture for superior grip",
      "24-detent high-resolution encoder",
      "Push-button functionality for secondary actions"
    ]
  },
  {
    id: "mic",
    label: "Built-in Microphone",
    image: closeupMic,
    title: "Voice meets touch.",
    description:
      "An integrated MEMS microphone with noise-canceling mesh enables on-device voice commands. Trigger macros or dictate text instantly.",
    details: [
      "High-fidelity MEMS digital microphone",
      "On-device AI processing for privacy",
      "Acoustic mesh for wind noise reduction",
      "Direct integration with OMNI Voice Engine"
    ]
  },
];

/* ─── Configurator ─── */
const chassisOptions = [
  { id: "silver",   label: "Silver Aluminum", color: "#E5E7EB" },
  { id: "stealth",  label: "Stealth Matte",   color: "#1F2937" },
  { id: "midnight", label: "Midnight Blue",   color: "#1E3A5F" },
  { id: "purple",   label: "Dark Purple",     color: "#4C1D95" },
];
const keycapOptions = [
  { id: "white", label: "Arctic White", color: "#E5E7EB" },
  { id: "black", label: "Obsidian Black", color: "#1F2937" },
  { id: "blue", label: "Electric Blue", color: "#3B82F6" },
  { id: "purple", label: "Dark Purple", color: "#4C1D95" },
];

const Store = () => {
  // Preload all product images immediately
  // Aggressively preload ALL store images before anything renders
  useEffect(() => {
    const allImages = [
      // Combo images - preload current selection first, then rest
      COMBO_IMAGES[`${chassisOptions[0].id}-${keycapOptions[0].id}`] || SilverWhite,
      ...Object.values(COMBO_IMAGES),
      // Closeup images
      closeupKeycaps, closeupOled, closeupEncoders, closeupMic, closeupUsbc,
    ];

    // Remove duplicates
    const unique = [...new Set(allImages)];

    // Load first image with high priority immediately
    const first = new window.Image();
    first.fetchPriority = 'high';
    first.src = unique[0];

    // Load rest after tiny delay so first image gets bandwidth priority
    requestAnimationFrame(() => {
      unique.slice(1).forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    });
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [chassis, setChassis] = useState(chassisOptions[0]);
  const [keycap, setKeycap] = useState(keycapOptions[0]);
  const [proAI, setProAI] = useState(false);
  const [extendedWarranty, setExtendedWarranty] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const basePrice = 189;
  const totalPrice = basePrice + (proAI ? 149 : 0) + (extendedWarranty ? 79 : 0);

  const handleAddToCart = async () => {
    const comboKey = `${chassis.id}-${keycap.id}`;
    const previewImage = COMBO_IMAGES[comboKey] || CHASSIS_DEFAULT[chassis.id] || SilverWhite;

    const item = {
      productId: `omni-${chassis.id}-${keycap.id}`,
      name: "OMNI Custom",
      price: Number(totalPrice),
      quantity: 1,
      chassis: chassis.label,
      keycap: keycap.label,
      addons: [
        ...(proAI ? ["Pro-AI Package"] : []),
        ...(extendedWarranty ? ["OMNI Care+"] : [])
      ],
      image: previewImage,
    };

    try {
      await addToCart(item);
      setAddedToCart(true);
      toast.success("Added to cart!");
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <ParticleField />
      <MouseSpotlight />
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div className="text-center z-10" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.p
            className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Introducing
          </motion.p>
          <motion.h1
            className="text-6xl md:text-[8rem] font-heading font-bold tracking-wider text-gradient leading-none mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            OMNI
          </motion.h1>
          <motion.p
            className="text-foreground/80 text-xl md:text-2xl font-body font-light mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            One device. Infinite control.
          </motion.p>
          <motion.p
            className="text-muted-foreground/50 text-sm max-w-md mx-auto font-body mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            A tactile macro pad powered by on-device AI. Mechanical switches, OLED display, rotary encoders, and voice control — all in one.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <a href="#configure">
              <button className="btn-glass-primary px-9 py-3.5 text-sm">Configure Yours</button>
            </a>
            <a href="#closer-look">
              <button className="btn-glass px-9 py-3.5 text-sm">Explore Features</button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ═══════ LOVE AT FIRST TOUCH ═══════ */}
      <section className="relative py-24 md:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Love at first click.
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Introducing OMNI — a macro pad that feels as good as it works. With a premium aluminum chassis,
            custom mechanical switches, and built-in AI voice control, it's the tool you didn't know you needed.
            Starting at <span className="text-foreground font-semibold">189 TN</span>.
          </motion.p>
        </div>
      </section>

      {/* ═══════ COLOR SHOWCASE ═══════ */}
      <ColorShowcase colors={colorOptions} />

      {/* ═══════ TAKE A CLOSER LOOK ═══════ */}
      <div id="closer-look">
        <CloserLook items={closerLookItems} />
      </div>

      {/* ═══════ 3D CONFIGURATOR ═══════ */}
      <section id="configure" className="relative py-24 md:py-40 px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">Configure</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-4">
            Build Your <span className="text-gradient">OMNI</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Choose your chassis, keycaps, and upgrades. See it live in 3D.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="glass rounded-3xl overflow-hidden aspect-square relative flex items-center justify-center p-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={chassis.id}
                src={COMBO_IMAGES[`${chassis.id}-${keycap.id}`] || CHASSIS_DEFAULT[chassis.id] || SilverWhite}
                alt={chassis.label}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            
            {/* Visual indicators for selected keycap color */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="px-4 py-2 rounded-full glass border-white/10 text-[10px] font-heading tracking-widest uppercase text-foreground/60">
                {chassis.label} / {keycap.label}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Chassis */}
            <div>
              <h3 className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Chassis Finish</h3>
              <div className="flex gap-4 flex-wrap">
                {chassisOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setChassis(opt)}
                    className={`flex flex-col items-center gap-3 glass rounded-2xl p-5 transition-all min-w-[110px] ${
                      chassis.id === opt.id ? "glow-blue border-primary/60 scale-105" : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 shadow-inner" style={{ backgroundColor: opt.color }} />
                    <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-foreground/80">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Keycaps */}
            <div>
              <h3 className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Keycap Color</h3>
              <div className="flex gap-4 flex-wrap">
                {keycapOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setKeycap(opt)}
                    className={`flex flex-col items-center gap-3 glass rounded-2xl p-5 transition-all min-w-[110px] ${
                      keycap.id === opt.id ? "glow-blue border-primary/60 scale-105" : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 shadow-inner" style={{ backgroundColor: opt.color }} />
                    <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-foreground/80">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Optional Add-Ons</h3>
              <div className="space-y-4">
                {/* Pro AI */}
                <button
                  onClick={() => setProAI(!proAI)}
                  className={`w-full glass rounded-2xl p-5 text-left transition-all border ${
                    proAI ? "glow-blue border-primary/50 bg-primary/5" : "border-white/5 hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${proAI ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-foreground font-heading font-bold text-sm">Pro-AI Package</p>
                        <p className="text-muted-foreground text-xs font-body">Advanced voice processing & custom macros</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-heading font-bold text-sm">+149 TN</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        proAI ? "bg-primary border-primary" : "border-white/20"
                      }`}>
                        {proAI && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Extended Warranty */}
                <button
                  onClick={() => setExtendedWarranty(!extendedWarranty)}
                  className={`w-full glass rounded-2xl p-5 text-left transition-all border ${
                    extendedWarranty ? "glow-blue border-primary/50 bg-primary/5" : "border-white/5 hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${extendedWarranty ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-foreground font-heading font-bold text-sm">OMNI Care+</p>
                        <p className="text-muted-foreground text-xs font-body">2-year accidental damage protection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-heading font-bold text-sm">+79 TN</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        extendedWarranty ? "bg-primary border-primary" : "border-white/20"
                      }`}>
                        {extendedWarranty && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-muted-foreground text-xs font-heading tracking-widest uppercase">Total</p>
                  <p className="text-4xl font-heading font-bold text-foreground">{totalPrice} TN</p>
                </div>
                <p className="text-muted-foreground/50 text-xs font-body">TND · Free shipping nationwide</p>
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-full font-heading font-medium tracking-wide text-sm transition-all duration-500 ${
                  addedToCart ? "bg-green-500 text-foreground" : "btn-glass-primary"
                }`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart — {totalPrice} TN
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Store;
