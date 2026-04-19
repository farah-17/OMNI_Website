import { motion } from "framer-motion";

interface ColorOption {
  id: string;
  label: string;
  color: string;
  image: string;
}

interface ColorShowcaseProps {
  colors: ColorOption[];
}

const ColorShowcase = ({ colors }: ColorShowcaseProps) => {
  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Stunning finishes.{" "}
          <span className="text-muted-foreground">One iconic design.</span>
        </motion.h2>

        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative w-full max-w-4xl">
            <img
              src={colors[0].image}
              alt="OMNI Device Showcase"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ColorShowcase;
