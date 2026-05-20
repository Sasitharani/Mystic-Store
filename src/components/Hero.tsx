import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-mystic-indigo pt-20">
      {/* Hero Image / Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&q=80&w=2000" 
          alt="Mystical Altar"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mystic-indigo via-transparent to-mystic-indigo/90" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sacred-gold/30 bg-sacred-gold/5 text-sacred-gold text-[10px] uppercase tracking-[0.4em] mb-8"
        >
          <Sparkles className="w-3 h-3" />
          <span>Sanctuary in a Pocket</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl text-aged-paper leading-[0.9] mb-8 italic"
        >
          Remedies for the <br />
          <span className="text-sacred-gold not-italic">Internal Soul</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-aged-paper/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Guided by the wisdom of the Divine Mother. High-aesthetic digital journals, audio transmissions, and ritual workbooks to nurture your path.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button 
            onClick={onCtaClick}
            className="group relative px-10 py-5 bg-sacred-gold text-mystic-indigo font-medium tracking-widest uppercase text-xs overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button className="text-aged-paper/40 hover:text-sacred-gold transition-colors text-xs uppercase tracking-widest py-4">
            Our Origin Story
          </button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 right-12 hidden lg:block"
      >
        <div className="w-32 h-32 border border-sacred-gold/20 rounded-full flex items-center justify-center p-4">
          <div className="w-full h-full border border-sacred-gold/40 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
