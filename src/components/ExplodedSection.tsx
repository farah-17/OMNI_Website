import { motion } from "framer-motion";
import omniExploded from "@/assets/omni-exploded-nobg.png";

const ExplodedSection = () => {
  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">Engineering</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Precision in every layer.
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed mb-8">
            The OMNI is built from the inside out. A sandwiched PCB design, CNC-machined aluminum chassis, and factory-lubed stabilizers give you a device that feels as premium as it performs.
          </p>
          <ul className="space-y-4">
            {[
              "CNC-machined 6061 aluminum chassis",
              "Hot-swap PCB with gold-plated contacts",
              "Factory-lubed, zero-rattle stabilizers",
              "USB-C detachable braided cable",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-foreground/80 font-body text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <img
            src={omniExploded}
            alt="OMNI Exploded View"
            fetchPriority="high"
            className="w-full max-w-lg h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ExplodedSection;
