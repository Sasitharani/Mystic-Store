import { motion } from "motion/react";
import { Product } from "../constants";
import { Plus, Expand } from "lucide-react";

interface BentoGridProps {
  products: Product[];
  onProductClick: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export default function BentoGrid({ products, onProductClick, onAddToCart }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {products.map((product, idx) => {
        const isWide = idx % 5 === 0;
        const isTall = idx % 4 === 1;
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative overflow-hidden bg-mystic-indigo/5 border border-mystic-indigo/10 flex flex-col ${
              isWide ? "md:col-span-8 h-[400px]" : "md:col-span-4 h-[400px]"
            } ${isTall && !isWide ? "md:row-span-2 h-[832px]" : ""}`}
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mystic-indigo/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="relative z-10 mt-auto p-8 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-sacred-gold">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-sacred-gold text-mystic-indigo text-[8px] uppercase tracking-widest px-2 py-0.5 font-bold animate-pulse">
                    High Demand
                  </span>
                )}
              </div>
              <h3 className="text-2xl text-aged-paper mb-2">{product.name}</h3>
              <p className="text-aged-paper/60 text-sm mb-6 line-clamp-2 max-w-sm group-hover:text-aged-paper transition-colors">
                {product.cosmicBenefit}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-aged-paper/40 line-through decoration-sacred-gold/40">${Math.round(product.price * 1.5)}</span>
                    <span className="text-[10px] text-sacred-gold font-bold">EARLY SEED</span>
                  </div>
                  <span className="text-xl font-medium text-aged-paper">${product.price}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onProductClick(product.id)}
                    className="p-3 bg-white/5 hover:bg-sacred-gold/20 text-aged-paper border border-white/10 transition-all backdrop-blur-md rounded-full group/btn"
                    title="Read Genesis"
                  >
                    <Expand className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onAddToCart(product.id)}
                    className="flex items-center gap-2 px-8 py-3 bg-sacred-gold text-mystic-indigo text-xs uppercase tracking-widest font-black hover:bg-white transition-all shadow-lg hover:shadow-sacred-gold/20"
                  >
                    Claim Access
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-mystic-indigo bg-mystic-indigo/20 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${product.id}${i}`} alt="user" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-[8px] uppercase tracking-widest opacity-40">Energy matched by 400+</span>
              </div>
            </div>

            {/* Premium Border Overlay */}
            <div className="absolute inset-0 border border-sacred-gold/0 group-hover:border-sacred-gold/30 transition-all pointer-events-none m-4" />
          </motion.div>
        );
      })}
    </div>
  );
}
