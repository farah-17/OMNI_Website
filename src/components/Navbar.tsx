import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Settings, Trash2, Plus, Minus, CreditCard, CheckCircle2, ChevronLeft } from "lucide-react";
import { useAuth, useCart } from "@/lib/context";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";

/* ── Checkout step types ── */
type CheckoutStep = "cart" | "identity" | "success";

interface IdForm {
  fullName: string;
  idNumber: string;
  phone: string;
  address: string;
  city: string;
}

const EMPTY_FORM: IdForm = { fullName: "", idNumber: "", phone: "", address: "", city: "" };

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [idForm, setIdForm] = useState<IdForm>(EMPTY_FORM);
  const [focused, setFocused] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const location = useLocation();
  const { user } = useAuth();
  const { items, removeFromCart, addToCart, clearCart } = useCart();

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Reset checkout state when sheet closes */
  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setTimeout(() => {
        setCheckoutStep("cart");
        setIdForm(EMPTY_FORM);
      }, 300);
    }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); }
    catch (error) { console.error("Login failed:", error); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); }
    catch (error) { console.error("Logout failed:", error); }
  };

  const handlePlaceOrder = async () => {
    if (!idForm.fullName || !idForm.idNumber || !idForm.phone || !idForm.address || !idForm.city) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsPlacing(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user?.uid || "guest",
        userEmail: user?.email || null,
        items,
        total: cartTotal,
        identity: idForm,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      await clearCart();
      setCheckoutStep("success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const links = [
    { label: "Home", to: "/" },
    { label: "Lineup", to: "/lineup" },
    { label: "Store", to: "/store" },
    { label: "Contact", to: "/contact" },
  ];

  /* ── Field config for ID form ── */
  const fields = [
    { key: "fullName",  label: "Full Name",       placeholder: "As on your ID card",  type: "text" },
    { key: "idNumber",  label: "National ID Number", placeholder: "e.g. 12345678",     type: "text" },
    { key: "phone",     label: "Phone Number",    placeholder: "+216 XX XXX XXX",     type: "tel"  },
    { key: "address",   label: "Delivery Address", placeholder: "Street & number",     type: "text" },
    { key: "city",      label: "City",            placeholder: "e.g. Tunis",          type: "text" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav" : "bg-background/0"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-heading font-bold text-gradient tracking-widest">
          OMNI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-xs font-heading tracking-[0.2em] uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">

          {/* ══════════════ CART SHEET ══════════════ */}
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </SheetTrigger>

            <SheetContent className="glass border-l border-white/10 w-full sm:max-w-md flex flex-col overflow-hidden">

              {/* ── STEP: CART ── */}
              <AnimatePresence mode="wait">
                {checkoutStep === "cart" && (
                  <motion.div
                    key="cart"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SheetHeader className="pb-4">
                      <SheetTitle className="font-heading tracking-widest uppercase">Your Cart</SheetTitle>
                      <SheetDescription className="text-muted-foreground">
                        Review your OMNI configuration before checkout.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                      {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <ShoppingCart size={32} className="text-muted-foreground/30" />
                          </div>
                          <p className="text-muted-foreground font-body">Your cart is empty.</p>
                          <Link to="/store" onClick={() => setSheetOpen(false)}>
                            <Button variant="outline" className="rounded-full">Start Shopping</Button>
                          </Link>
                        </div>
                      ) : (
                        items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 glass rounded-2xl border border-white/5">
                            <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-heading font-bold">{item.name}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {item.chassis} / {item.keycap}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-3 glass px-2 py-1 rounded-lg border border-white/5">
                                  <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-foreground"><Minus size={12} /></button>
                                  <span className="text-xs font-bold">{item.quantity}</span>
                                  <button onClick={() => addToCart(item)} className="text-muted-foreground hover:text-foreground"><Plus size={12} /></button>
                                </div>
                                <p className="text-sm font-heading font-bold text-primary">{item.price * item.quantity} TN</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {items.length > 0 && (
                      <SheetFooter className="border-t border-white/10 pt-6 flex-col gap-4">
                        <div className="flex justify-between items-center w-full">
                          <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest">Subtotal</p>
                          <p className="text-2xl font-heading font-bold">{cartTotal} TN</p>
                        </div>
                        <Button
                          onClick={() => setCheckoutStep("identity")}
                          className="w-full rounded-full py-6 font-heading tracking-widest uppercase"
                        >
                          Proceed to Checkout
                        </Button>
                      </SheetFooter>
                    )}
                  </motion.div>
                )}

                {/* ── STEP: IDENTITY ── */}
                {checkoutStep === "identity" && (
                  <motion.div
                    key="identity"
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SheetHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCheckoutStep("cart")}
                          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <div>
                          <SheetTitle className="font-heading tracking-widest uppercase">Delivery Info</SheetTitle>
                          <SheetDescription className="text-muted-foreground text-xs mt-0.5">
                            Required for order verification & delivery.
                          </SheetDescription>
                        </div>
                      </div>
                    </SheetHeader>

                    {/* Order summary pill */}
                    <div className="flex items-center justify-between glass rounded-2xl px-5 py-3 border border-white/5 mb-4">
                      <p className="text-xs font-heading text-muted-foreground uppercase tracking-widest">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                      <p className="text-lg font-heading font-bold text-primary">{cartTotal} TN</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {fields.map((f) => (
                        <div key={f.key}>
                          <label className="text-[10px] font-heading tracking-[0.2em] uppercase text-muted-foreground mb-1.5 block">
                            {f.label}
                          </label>
                          <input
                            type={f.type}
                            value={idForm[f.key as keyof IdForm]}
                            onChange={(e) => setIdForm({ ...idForm, [f.key]: e.target.value })}
                            onFocus={() => setFocused(f.key)}
                            onBlur={() => setFocused(null)}
                            placeholder={f.placeholder}
                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/30 outline-none transition-all duration-300 ${
                              focused === f.key
                                ? "border-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          />
                        </div>
                      ))}

                      {/* ID card notice */}
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                        <CreditCard size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                          Your National ID number is used solely for delivery verification and is stored securely. We do not share your data with third parties.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 mt-4">
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isPlacing}
                        className="w-full rounded-full py-6 font-heading tracking-widest uppercase"
                      >
                        {isPlacing ? (
                          <span className="flex items-center gap-2 animate-pulse">Processing...</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <CreditCard size={16} /> Place Order — {cartTotal} TN
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP: SUCCESS ── */}
                {checkoutStep === "success" && (
                  <motion.div
                    key="success"
                    className="flex flex-col h-full items-center justify-center text-center px-4 gap-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                    >
                      <CheckCircle2 size={40} className="text-green-400" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Order Placed!</h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs">
                        Thank you, {idForm.fullName.split(" ")[0]}. Your OMNI is being prepared. We'll contact you at <span className="text-foreground">{idForm.phone}</span> to confirm delivery.
                      </p>
                    </div>

                    <div className="glass rounded-2xl p-5 w-full border border-white/5 text-left space-y-2">
                      <p className="text-[10px] font-heading tracking-widest uppercase text-muted-foreground mb-3">Order Summary</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Items</span>
                        <span className="font-heading font-semibold">{cartCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Delivery to</span>
                        <span className="font-heading font-semibold">{idForm.city}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                        <span className="text-muted-foreground font-body">Total Paid</span>
                        <span className="font-heading font-bold text-primary text-lg">{cartTotal} TN</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSheetOpenChange(false)}
                      variant="outline"
                      className="rounded-full px-8"
                    >
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

            </SheetContent>
          </Sheet>

          {/* User Profile / Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" className="w-full h-full object-cover" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border border-white/10 w-56 mt-2" align="end">
                <DropdownMenuLabel className="font-heading tracking-wider">
                  <p className="text-sm font-bold">{user.displayName || "User"}</p>
                  <p className="text-[10px] text-muted-foreground font-normal truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/5 cursor-pointer gap-2">
                  <Settings size={14} />
                  <span className="text-xs">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="focus:bg-destructive/10 text-destructive cursor-pointer gap-2">
                  <LogOut size={14} />
                  <span className="text-xs">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={handleLogin} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <User size={20} />
            </button>
          )}

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          className="md:hidden glass-nav px-6 pb-6 pt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-heading tracking-wider ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
