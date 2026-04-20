import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloserLookItem {
  id: string;
  label: string;
  image: string;
  title: string;
  description: string;
  details?: string[];
}

interface CloserLookProps {
  items: CloserLookItem[];
}

const CloserLook = ({ items }: CloserLookProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<CloserLookItem | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  return (
    <section className="relative py-24 md:py-40 bg-black overflow-hidden">
      <div className="px-4 md:px-12 mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <motion.h2
          className="text-3xl sm:text-5xl md:text-8xl font-heading font-bold text-white tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Take a closer look.
        </motion.h2>
        
        <motion.p 
          className="text-white/40 font-body max-w-sm text-lg md:text-xl leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Every detail engineered for precision, tactile satisfaction, and aesthetic perfection.
        </motion.p>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-col gap-12 md:gap-40 px-4 md:px-12 max-w-7xl mx-auto"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-[#1c1c1e] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
              <motion.img
                src={item.image}
                alt={item.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />
              
              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-1000" />
              
              <div className="absolute inset-0 p-5 md:p-20 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="w-12 h-[1px] bg-primary/60" />
                  <p className="text-primary font-heading text-xs tracking-[0.4em] uppercase font-bold">
                    {item.label}
                  </p>
                </motion.div>
                
                <h3 className="text-2xl sm:text-4xl md:text-7xl font-heading font-bold text-white mb-4 md:mb-8 leading-[1.1] tracking-tight max-w-3xl">
                  {item.title}
                </h3>
                
                <div className="flex items-end justify-between gap-8">
                  <p className="text-white/50 font-body text-lg md:text-xl leading-relaxed max-w-xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-white/40 font-heading text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      Explore Detail
                    </span>
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-2xl">
                      <Plus className="w-8 h-8 transition-transform duration-500 group-hover:rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Glass Reflection Effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll Progress Indicator (Vertical) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-50">
        <span className="text-[10px] font-heading tracking-[0.3em] text-white/20 uppercase vertical-text transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-[2px] h-32 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          />
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 rotate-90" />
      </div>
      {/* ═══════ APPLE GLASS MODAL ═══════ */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#1c1c1e]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <p className="text-primary font-heading text-xs tracking-[0.3em] uppercase font-bold mb-6">
                  {selectedItem.label}
                </p>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8 leading-tight">
                  {selectedItem.title}
                </h2>
                <p className="text-white/60 font-body text-lg leading-relaxed mb-10">
                  {selectedItem.description}
                </p>
                
                <div className="space-y-4">
                  {selectedItem.details?.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-white/80 font-body text-sm">{detail}</p>
                    </div>
                  )) || (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-white/40 text-xs font-heading uppercase tracking-widest mb-2">Technical Spec</p>
                      <p className="text-white/90 font-body text-sm">Precision engineered components with a tolerance of less than 0.01mm for the ultimate tactile experience.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedItem(null)}
                  className="mt-12 btn-glass-primary py-4 px-10 self-start"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CloserLook;
