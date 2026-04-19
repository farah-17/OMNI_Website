import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="relative z-10 border-t border-border/30 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="text-xl font-heading font-bold text-gradient tracking-widest mb-3">OMNI</p>
          <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs">
            A tactile macro pad powered by on-device AI. Engineered in Tunisia. Designed for the world.
          </p>
        </div>
        <div>
          <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-4">Product</p>
          <ul className="space-y-2">
            {[
              { label: "Store", to: "/store" },
              { label: "Lineup", to: "/lineup" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm font-body text-muted-foreground/70 hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-4">Company</p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/contact"
                className="text-sm font-body text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between gap-4">
        <p className="text-xs text-muted-foreground/40 font-body">© 2025 OMNI. All rights reserved.</p>
        <p className="text-xs text-muted-foreground/40 font-body">Engineered in Tunisia</p>
      </div>
    </footer>
  );
};

export default FooterSection;
