import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import MouseSpotlight from "@/components/MouseSpotlight";
import FooterSection from "@/components/FooterSection";
import { Gamepad2, Code2, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: "zero-latency",
    name: "OMNI: Zero-Latency",
    tagline: "Built for Gamers",
    description:
      "Millisecond response times. RGB integration for game states — Health, Cooldowns, Ammo. Macro keys tuned for competitive play.",
    color: "from-red-500/20 to-purple-500/20",
    glowColor: "shadow-red-500/20",
    accentClass: "text-red-400",
    bgAccent: "bg-red-500/10",
    icon: Gamepad2,
    specs: ["< 1ms Response", "RGB Game Sync", "Tournament Macros", "Anti-Ghosting"],
  },
  {
    id: "core",
    name: "OMNI: Core",
    tagline: "Built for Engineers",
    description:
      "Pre-loaded with IDE shortcuts for VS Code and JetBrains. CAD macros, terminal commands, and Git workflows at your fingertips. The workhorse.",
    color: "from-primary/20 to-glow-secondary/20",
    glowColor: "shadow-primary/20",
    accentClass: "text-primary",
    bgAccent: "bg-primary/10",
    icon: Code2,
    specs: ["IDE Shortcuts", "CAD Macros", "Git Workflows", "Terminal Triggers"],
  },
  {
    id: "scholar",
    name: "OMNI: Scholar",
    tagline: "Built for Students",
    description:
      "Integrated Pomodoro timers. One-touch citation and research triggers. Focus mode with distraction blocking. Study smarter.",
    color: "from-amber-500/20 to-green-500/20",
    glowColor: "shadow-amber-500/20",
    accentClass: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    icon: GraduationCap,
    specs: ["Pomodoro Timer", "Citation Triggers", "Focus Mode", "Research Tools"],
  },
];

const Lineup = () => {
  const [activeIdx, setActiveIdx] = useState(1);
  const [showCompare, setShowCompare] = useState(false);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(products.length - 1, i + 1));
  const active = products[activeIdx];

  return (
    <div className="relative min-h-screen bg-background">
      <ParticleField />
      <MouseSpotlight />
      <Navbar />

      <div className="relative z-10 pt-24 pb-16">
        <motion.div
          className="text-center px-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">The Lineup</p>
          <h1 className="text-3xl md:text-6xl font-heading font-bold text-foreground mb-4">
            Find Your <span className="text-gradient">OMNI</span>
          </h1>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Vertical-specific solutions engineered for your workflow.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={prev} className="btn-glass p-3 rounded-full" disabled={activeIdx === 0}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeIdx ? "bg-primary scale-125" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="btn-glass p-3 rounded-full" disabled={activeIdx === products.length - 1}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5 }}
              className={`glass rounded-3xl p-6 md:p-12 bg-gradient-to-br ${active.color}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${active.bgAccent} flex items-center justify-center mb-6`}>
                    <active.icon className={`w-7 h-7 ${active.accentClass}`} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{active.name}</h2>
                  <p className={`text-sm font-heading tracking-widest uppercase mb-4 ${active.accentClass}`}>
                    {active.tagline}
                  </p>
                  <p className="text-muted-foreground font-body leading-relaxed mb-8">{active.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {active.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${active.accentClass.replace("text-", "bg-")}`} />
                        <span className="text-foreground/80 text-sm font-body">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${active.color} blur-[60px] absolute`} />
                  <div className="relative glass rounded-2xl w-full aspect-square flex items-center justify-center">
                    <active.icon className={`w-24 h-24 ${active.accentClass} opacity-30`} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="btn-glass px-8 py-3 text-sm"
          >
            {showCompare ? "Hide Comparison" : "Compare All Models"}
          </button>
        </div>

        <AnimatePresence>
          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-5xl mx-auto px-6 mt-8 overflow-hidden"
            >
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="p-4 text-left text-muted-foreground font-heading text-xs tracking-widest uppercase">Feature</th>
                      {products.map((p) => (
                        <th key={p.id} className={`p-4 text-center font-heading text-xs tracking-widest uppercase ${p.accentClass}`}>
                          {p.name.split(": ")[1]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["Response Time", "AI Voice", "Custom Macros", "Connectivity", "Display"].map((feat) => (
                      <tr key={feat} className="border-b border-border/20">
                        <td className="p-4 text-foreground/80 font-body">{feat}</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center text-muted-foreground font-body">✓</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4 text-foreground/80 font-body">Starting Price</td>
                      <td className="p-4 text-center text-foreground font-heading font-semibold">219 TN</td>
                      <td className="p-4 text-center text-foreground font-heading font-semibold">189 TN</td>
                      <td className="p-4 text-center text-foreground font-heading font-semibold">169 TN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FooterSection />
    </div>
  );
};

export default Lineup;
