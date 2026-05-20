import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../constants";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { id: string; quantity: number }[];
  products: Product[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  products,
  onUpdateQuantity, 
  onRemove, 
  total,
  onCheckout 
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-mystic-indigo/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-aged-paper z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-mystic-indigo/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-sacred-gold" />
                <h2 className="text-xl font-serif">Your Sacristy</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-mystic-indigo/5 transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="text-sm uppercase tracking-widest">The sacristy is empty</p>
                </div>
              ) : (
                cart.map((item) => {
                  const product = products.find(p => p.id === item.id);
                  if (!product) return null;
                  
                  return (
                    <div key={item.id} className="flex gap-6">
                      <div className="w-24 h-32 bg-mystic-indigo/5 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-serif text-lg">{product.name}</h4>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-[10px] uppercase tracking-widest text-mystic-indigo/40 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-mystic-indigo/60 mb-4">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-mystic-indigo/10 rounded-full px-2 py-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:text-sacred-gold transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:text-sacred-gold transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-serif">${product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 bg-mystic-indigo text-aged-paper border-t border-sacred-gold/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-[0.2em] opacity-60">Sustenance Contribution</span>
                  <span className="text-2xl font-serif text-sacred-gold">${total}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-5 bg-sacred-gold text-mystic-indigo font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  Secure Digital Access <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center mt-4 opacity-40 uppercase tracking-widest">
                  Instant download delivered to your email
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
