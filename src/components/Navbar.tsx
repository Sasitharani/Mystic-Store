import { ShoppingBag, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-aged-paper transition-all duration-300">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <Moon className="w-5 h-5 text-sacred-gold" />
        <span className="font-serif text-xl tracking-tighter">Mystic Artifacts</span>
      </motion.div>

      {/* Centered Catalog link when not scrolled (absolute centering for perfect balance) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              key="catalog-center"
              layoutId="catalog-link"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="text-xs uppercase tracking-[0.3em] font-medium hover:opacity-100 transition-all cursor-pointer"
            >
              <a href="#catalog">Catalog</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right control panel with optionally relocated Catalog link and Cart button */}
      <div className="flex items-center gap-8">
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              key="catalog-right"
              layoutId="catalog-link"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="hidden md:block text-xs uppercase tracking-[0.3em] font-medium hover:opacity-100 transition-all cursor-pointer"
            >
              <a href="#catalog">Catalog</a>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onCartClick}
          className="relative group p-2"
        >
          <ShoppingBag className="w-6 h-6 group-hover:text-sacred-gold transition-colors" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-sacred-gold text-mystic-indigo text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </nav>
  );
}
