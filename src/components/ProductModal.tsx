import { motion } from "motion/react";
import { X, Sparkles, Shield, Zap, Plus } from "lucide-react";
import { Product } from "../constants";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (id: string) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-mystic-indigo/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl bg-aged-paper overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-mystic-indigo text-aged-paper rounded-full hover:bg-sacred-gold hover:text-mystic-indigo transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 h-80 md:h-auto overflow-hidden bg-mystic-indigo/5">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-sacred-gold mb-3 block">
              {product.category}
            </span>
            <h2 className="text-4xl md:text-5xl mb-4 italic leading-tight">{product.name}</h2>
            <p className="text-mystic-indigo/60 leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="text-3xl font-serif text-mystic-indigo">${product.price}</div>
          </div>

          <div className="bg-mystic-indigo/5 p-6 border-l-2 border-sacred-gold mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sacred-gold" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-mystic-indigo">Cosmic Benefit</h4>
            </div>
            <p className="text-sm italic text-mystic-indigo/80">
              "{product.cosmicBenefit}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-sacred-gold/10 text-sacred-gold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">
                {(product.id === "journal-20" || product.id === "journal-50") ? "Personalized" : "Instant Access"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-sacred-gold/10 text-sacred-gold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium opacity-60">{product.fileFormat}</span>
            </div>
          </div>

          {(product.id === "journal-20" || product.id === "journal-50") && (
            <div className="mb-8 p-4 bg-sacred-gold/5 border border-sacred-gold/10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-sacred-gold font-bold block mb-3">Sacred Name for Inscription</label>
              <input 
                type="text" 
                placeholder="Enter your name..."
                className="w-full bg-transparent border-b border-sacred-gold/20 py-2 text-sm focus:border-sacred-gold outline-none transition-all italic"
              />
              <p className="text-[8px] uppercase tracking-widest opacity-40 mt-2">This name will be digitally woven into each contemplation.</p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-4">
            <button 
              onClick={() => onAddToCart(product.id)}
              className="w-full py-5 bg-mystic-indigo text-aged-paper uppercase tracking-[0.2em] text-xs font-black hover:bg-sacred-gold hover:text-mystic-indigo transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              {product.price === 0 ? "Enter Digital Sanctuary (Free)" : `Claim Full Digital Access — $${product.price}`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
