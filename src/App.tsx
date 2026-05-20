/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS, Category, Product, DEFAULT_ARTIFACT_PAGES } from "./constants";
import { JournalPage } from "./types";
import { Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";
import CheckoutModal from "./components/CheckoutModal";
import AdminDashboard from "./components/AdminDashboard";
import SeekerJournalView from "./components/SeekerJournalView";
import ComplianceModal from "./components/ComplianceModal";

const INITIAL_JOURNAL_PAGES: JournalPage[] = [
  {
    id: 1,
    title: "Greeting the Inner Light",
    subtitle: "Opening your internal gates",
    content: "My heart is a garden waiting for the light of awareness. Today I choose to walk with soft feet and a clear mind, noticing the growth within.",
    prompt: "What part of your inner child felt unseen today? What does that part of you need to hear from you right now?",
    aesthetic: "Gold"
  },
  {
    id: 2,
    title: "The Weight of Lineage",
    subtitle: "Unburdening the heart",
    content: "I carry the strength of my ancestors, but I do not have to carry their sorrow. I release the chains of expectation and embrace my own path.",
    prompt: "If you could release one burden you've been carrying for others, what would it be? How would your heart feel in its absence?",
    aesthetic: "Gold"
  }
];

export default function App() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSeekerJournalOpen, setIsSeekerJournalOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState<"terms" | "privacy" | "refund" | "shipping" | "contact">("terms");

  const openCompliance = (tab: "terms" | "privacy" | "refund" | "shipping" | "contact") => {
    setComplianceTab(tab);
    setIsComplianceOpen(true);
  };
  
  // Real products state, synced with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem("mystic_products");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: Product) => p.id !== "journal-50" && p.id !== "journal-bundle");
        }
      } catch (e) {
        console.error("Error loading products from state:", e);
      }
    }
    return PRODUCTS;
  });

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("mystic_products", JSON.stringify(newProducts));
  };

  // Journal questions synced with localStorage so they never get removed from sync on refresh
  const [journalPages, setJournalPages] = useState<JournalPage[]>(() => {
    const stored = localStorage.getItem("mystic_artifact_pages_journal-free") || localStorage.getItem("mystic_journal_pages");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error loading journal pages:", e);
      }
    }
    return INITIAL_JOURNAL_PAGES;
  });

  const updateJournalPages = (newPages: JournalPage[]) => {
    setJournalPages(newPages);
    localStorage.setItem("mystic_artifact_pages_journal-free", JSON.stringify(newPages));
    localStorage.setItem("mystic_journal_pages", JSON.stringify(newPages));
  };

  const [activeJournalPages, setActiveJournalPages] = useState<JournalPage[]>([]);

  const openJournalViewer = (productId: string) => {
    const stored = localStorage.getItem(`mystic_artifact_pages_${productId}`);
    let loadedPages: JournalPage[] = [];
    if (stored) {
      try {
        loadedPages = JSON.parse(stored);
      } catch (e) {
        console.error("Error loading customized pages for viewer:", e);
      }
    }

    if (!loadedPages || loadedPages.length === 0) {
      if (productId === "journal-free") {
        loadedPages = journalPages;
      } else {
        loadedPages = DEFAULT_ARTIFACT_PAGES[productId] || [];
      }
    }

    setActiveJournalPages(loadedPages);
    setIsSeekerJournalOpen(true);
  };

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const currentProduct = selectedProduct ? products.find(p => p.id === selectedProduct) : null;

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen grain overflow-x-hidden">
      {/* Background Glows */}
      <div className="glow w-[500px] h-[500px] -top-48 -left-48" />
      <div className="glow w-[400px] h-[400px] top-1/2 -right-48 opacity-10" />
      <div className="glow w-[600px] h-[600px] -bottom-48 left-1/3 opacity-15" />

      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <main className="relative z-10">
        <Hero onCtaClick={() => {
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Detailed Journal Collection */}
        <section id="catalog" className="py-24 px-4 max-w-7xl mx-auto border-t border-mystic-indigo/5">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sacred-gold text-xs uppercase tracking-[0.4em] font-bold block">The Archives</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-mystic-indigo">The Sacred Registry</h2>
            <p className="text-mystic-indigo/60 max-w-xl mx-auto">Curated mirrors for the soul, engineered to dissolve negativity and realign your internal frequency. Choose your depth of inquiry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.category === "Digital Journals").map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-mystic-indigo/5 p-6 flex flex-col h-full hover:border-sacred-gold/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-sacred-gold/5"
              >
                <div className="aspect-square mb-6 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-mystic-indigo/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-mystic-indigo tracking-widest uppercase">${product.price}</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-serif italic text-mystic-indigo leading-tight">{product.name}</h3>
                  <p className="text-sm text-mystic-indigo/60 leading-relaxed line-clamp-3">{product.description}</p>
                  
                  <div className="pt-4 border-t border-mystic-indigo/5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-3 h-3 text-sacred-gold" />
                      <span className="text-[9px] uppercase tracking-widest text-sacred-gold font-bold">{product.cosmicBenefit}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedProduct(product.id)}
                        className="flex-1 py-3 text-[10px] uppercase tracking-[0.15em] font-black border border-mystic-indigo/10 hover:border-mystic-indigo hover:bg-mystic-indigo/5 transition-all"
                      >
                        Enter Path
                      </button>
                      <button 
                        onClick={() => addToCart(product.id)}
                        className="px-4 py-3 bg-sacred-gold text-mystic-indigo text-[10px] uppercase tracking-[0.15em] font-black hover:bg-mystic-indigo hover:text-aged-paper transition-all shadow-md flex items-center justify-center gap-1"
                        title="Add to Sacred Cart"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Testimonials - Social Proof */}
        <section className="bg-mystic-indigo/5 py-32 border-y border-mystic-indigo/5 overflow-hidden relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-serif italic mb-16 text-mystic-indigo/80">Whispers from the Collective</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex gap-1 text-sacred-gold">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-lg italic font-serif leading-relaxed">"The Emergency Audio-Pills saved my peace during a high-stakes meeting. It felt like the Mother's hand on my shoulder."</p>
                <p className="text-[10px] uppercase tracking-widest opacity-40">— Elena, London</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex gap-1 text-sacred-gold">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-lg italic font-serif leading-relaxed">"The Shadow Work journal is more than a PDF. The aesthetics alone shifted my mood before I even wrote a word."</p>
                <p className="text-[10px] uppercase tracking-widest opacity-40">— Marcus, NY</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-mystic-indigo text-aged-paper py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-sacred-gold mb-6">Mystic Artifacts</h3>
            <p className="text-aged-paper/60 leading-relaxed">
              Serving seekers of the unseen. Our mission is to bridge the material and spiritual worlds through artifacts of power.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-sacred-gold/50 mb-6 font-bold">Explore</h4>
            <ul className="space-y-4 text-sm tracking-wide">
              <li>
                <a 
                  href="#catalog" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-sacred-gold transition-colors"
                >
                  Catalog
                </a>
              </li>
              <li>
                <button 
                  onClick={() => openCompliance("contact")} 
                  className="hover:text-sacred-gold transition-colors text-left cursor-pointer"
                >
                  Support Channel
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-sacred-gold/50 mb-6 font-bold">Grounding</h4>
            <ul className="space-y-4 text-sm tracking-wide">
              <li>
                <button 
                  onClick={() => openCompliance("privacy")} 
                  className="hover:text-sacred-gold transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openCompliance("terms")} 
                  className="hover:text-sacred-gold transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openCompliance("refund")} 
                  className="hover:text-sacred-gold transition-colors text-left cursor-pointer"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openCompliance("shipping")} 
                  className="hover:text-sacred-gold transition-colors text-left cursor-pointer"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openCompliance("contact")} 
                  className="hover:text-sacred-gold transition-colors text-left font-bold text-sacred-gold/80"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-aged-paper/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-xs text-aged-paper/40 tracking-widest uppercase cursor-default"
            onDoubleClick={() => setIsAdminOpen(true)}
          >
            © 2026 Mystic Artifacts Shop. Blessed be.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-aged-paper/20 underline decoration-sacred-gold/20" onClick={() => setIsAdminOpen(true)}>GPAY</span>
            <span className="text-xs text-aged-paper/20">VISA</span>
            <span className="text-xs text-aged-paper/20">AMEX</span>
          </div>
        </div>
      </footer>

      {isAdminOpen && (
        <AdminDashboard 
          pages={journalPages}
          setPages={updateJournalPages}
          products={products}
          setProducts={updateProducts}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        products={products}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        total={cartTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {currentProduct && (
          <ProductModal 
            product={currentProduct} 
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(id) => {
              const selectedProd = products.find((p) => p.id === id);
              // Only bypass directly to visual journal if it is free (price === 0)
              if (selectedProd && selectedProd.category === "Digital Journals" && selectedProd.price === 0) {
                openJournalViewer(id);
                setSelectedProduct(null);
              } else {
                addToCart(id);
                setSelectedProduct(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      {isSeekerJournalOpen && (
        <SeekerJournalView 
          pages={activeJournalPages}
          onClose={() => setIsSeekerJournalOpen(false)} 
          onAddToCart={addToCart}
        />
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        total={cartTotal}
      />

      <ComplianceModal 
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
        initialTab={complianceTab}
      />
    </div>
  );
}
