import { motion } from "framer-motion";
import { Cpu, Mic, RotateCcw, Monitor, Zap, Layers } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "3×3 Mechanical Grid",
    description: "Hot-swappable Cherry MX-style switches with tactile feedback tuned for speed and precision.",
  },
  {
    icon: Monitor,
    title: "OLED Display",
    description: "0.96\" high-contrast monochrome screen showing layer, mode, and custom graphics in real time.",
  },
  {
    icon: RotateCcw,
    title: "Dual Rotary Encoders",
    description: "CNC-machined 6061 aluminum knobs with diamond knurling for volume, zoom, and precision control.",
  },
  {
    icon: Mic,
    title: "Built-in Microphone",
    description: "Integrated MEMS mic with noise-canceling mesh for on-device voice commands and dictation.",
  },
  {
    icon: Cpu,
    title: "OMNI OS v1.0",
    description: "Custom operating system purpose-built for seamless hardware-software integration.",
  },
  {
    icon: Zap,
    title: "Pro-AI Package",
    description: "Advanced natural language processing for smarter voice commands and custom macro workflows.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 md:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">Features</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-4">
            Built different. <span className="text-gradient">By design.</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Every component chosen to maximize productivity and tactile satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-2xl p-8 hover:glow-blue transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
