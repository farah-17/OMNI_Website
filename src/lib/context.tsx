import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, addDoc, onSnapshot, collection, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  settings: { theme: string; notifications: boolean };
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  chassis?: string;
  keycap?: string;
  addons?: string[];
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, profile: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
              settings: { theme: 'dark', notifications: true }
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          } else {
            setProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/* ─── CART — works for both guests (localStorage) and signed-in users (Firestore) ─── */

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  loading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
});

const GUEST_CART_KEY = 'omni_guest_cart';

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGuestCart(items: CartItem[]) {
  try { localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items)); } catch {}
}

function guestId() {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ── Sync: swap between guest localStorage ↔ Firestore on auth change ── */
  useEffect(() => {
    if (!user) {
      // Guest mode — load from localStorage
      setItems(loadGuestCart());
      setLoading(false);
      return;
    }

    // Signed-in — migrate any guest cart items first, then subscribe
    const cartRef = collection(db, 'users', user.uid, 'cart');

    const migrate = async () => {
      const guestItems = loadGuestCart();
      if (guestItems.length > 0) {
        for (const item of guestItems) {
          const { id, ...rest } = item;
          try {
            await addDoc(cartRef, { ...rest });
          } catch {}
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }
    };

    migrate();

    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const cartItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CartItem));
      setItems(cartItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/cart`);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (!user) {
      // Guest: update localStorage
      const current = loadGuestCart();
      const existing = current.find(i =>
        i.productId === item.productId &&
        i.chassis === item.chassis &&
        i.keycap === item.keycap
      );
      let updated: CartItem[];
      if (existing) {
        updated = current.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...current, { ...item, id: guestId(), quantity: item.quantity ?? 1 }];
      }
      saveGuestCart(updated);
      setItems(updated);
      return;
    }

    // Signed-in: Firestore
    const cartRef = collection(db, 'users', user.uid, 'cart');
    try {
      const existing = items.find(i =>
        i.productId === item.productId &&
        i.chassis === item.chassis &&
        i.keycap === item.keycap
      );
      if (existing) {
        // Update existing item quantity
        const itemRef = doc(db, 'users', user.uid, 'cart', existing.id);
        await setDoc(itemRef, {
          productId: existing.productId,
          name: existing.name,
          price: Number(existing.price),
          quantity: Number(existing.quantity) + 1,
          chassis: existing.chassis || '',
          keycap: existing.keycap || '',
          addons: existing.addons || [],
          image: existing.image || '',
        });
      } else {
        // Add new item using addDoc (auto-generates ID)
        await addDoc(cartRef, {
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          chassis: item.chassis || '',
          keycap: item.keycap || '',
          addons: item.addons || [],
          image: item.image || '',
        });
      }
    } catch (error) {
      console.error('Firestore addToCart error:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      const current = loadGuestCart();
      const item = current.find(i => i.id === itemId);
      let updated: CartItem[];
      if (item && item.quantity > 1) {
        updated = current.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        updated = current.filter(i => i.id !== itemId);
      }
      saveGuestCart(updated);
      setItems(updated);
      return;
    }

    const itemRef = doc(db, 'users', user.uid, 'cart', itemId);
    try {
      const item = items.find(i => i.id === itemId);
      if (item && item.quantity > 1) {
        await setDoc(itemRef, { ...item, quantity: item.quantity - 1 }, { merge: true });
      } else {
        await firestoreDeleteDoc(itemRef);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${itemId}`);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
      setItems([]);
      return;
    }
    for (const item of items) {
      await firestoreDeleteDoc(doc(db, 'users', user.uid, 'cart', item.id));
    }
  };

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
