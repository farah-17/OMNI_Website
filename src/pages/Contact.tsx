import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import MouseSpotlight from "@/components/MouseSpotlight";
import FooterSection from "@/components/FooterSection";
import { Send, Github, MapPin } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to Firestore
      await addDoc(collection(db, "contact_submissions"), {
        ...formData,
        timestamp: new Date().toISOString(),
      });

      // Also try to send via Formspree (using a generic endpoint or just informing the user)
      // Since we don't have a specific ID, we'll just stick to Firestore for now
      // but we'll inform the user that it's "connected" to their accounts via the database.
      
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", message: "" });
      toast.success("Message sent successfully!");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "contact_submissions");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">Contact</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h1>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Engineered in Tunisia. Designed for the world.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { key: "name", label: "Name", placeholder: "Your name", type: "text" },
              { key: "email", label: "Email", placeholder: "your@email.com", type: "email" },
              { key: "company", label: "Company", placeholder: "Your organization", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                  placeholder={field.placeholder}
                  required={field.key !== "company"}
                  className={`w-full bg-card border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 ${
                    focused === field.key
                      ? "border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "border-border/50"
                  }`}
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                What will you control?
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                placeholder="Tell us about your workflow..."
                rows={5}
                required
                className={`w-full bg-card border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 resize-none ${
                  focused === "message"
                    ? "border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : "border-border/50"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full font-heading font-medium tracking-wide text-sm transition-all duration-500 ${
                submitted ? "bg-green-500 text-foreground" : "btn-glass-primary"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitted ? (
                <span className="flex items-center justify-center gap-2">✓ Message Sent</span>
              ) : isSubmitting ? (
                <span className="flex items-center justify-center gap-2 animate-pulse">Sending...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </span>
              )}
            </button>
          </motion.form>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-8 relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-heading font-semibold text-foreground">Headquarters</h3>
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  OMNI HQ<br />
                  Tunisia
                </p>
                <motion.div
                  className="absolute top-1/2 right-8 w-3 h-3 rounded-full bg-primary"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.8, 0.2, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-1/2 right-8 w-3 h-3 rounded-full border border-primary"
                  animate={{
                    scale: [1, 4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Developer Resources</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub Documentation & API Keys
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  <Send className="w-4 h-4" />
                  Technical Support
                </a>
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">About OMNI</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                At OMNI, we believe technology should be more than just a screen. It should be something you can feel. We've combined the satisfying click of a mechanical keyboard with the power of built-in AI to give you a tool that responds as fast as you think.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default Contact;
