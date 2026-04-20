import { motion } from "framer-motion";

const specs = [
  { label: "Switch Type", value: "Cherry MX-style Hot-swap" },
  { label: "Display", value: "0.96\" OLED 128×64" },
  { label: "Encoders", value: "2× CNC Aluminum, 24-detent" },
  { label: "Microphone", value: "MEMS Digital, Noise-canceling" },
  { label: "Connectivity", value: "USB-C (detachable)" },
  { label: "Chassis", value: "6061 Aluminum alloy" },
  { label: "OS", value: "OMNI OS v1.0" },
  { label: "Dimensions", value: "120 × 100 × 35 mm" },
  { label: "Weight", value: "~320g" },
  { label: "Starting Price", value: "189 TN" },
];

const SpecsSection = () => {
  return (
    <section className="relative py-16 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">Specifications</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
            The details that matter.
          </h2>
        </motion.div>

        <motion.div
          className="glass rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className={`flex justify-between items-center px-4 md:px-8 py-4 md:py-5 ${
                i !== specs.length - 1 ? "border-b border-border/20" : ""
              }`}
            >
              <span className="text-muted-foreground font-body text-sm">{spec.label}</span>
              <span className="text-foreground font-heading font-semibold text-sm">{spec.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SpecsSection;
