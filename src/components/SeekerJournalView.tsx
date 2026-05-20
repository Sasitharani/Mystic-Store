import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowLeft, Download, PenTool, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { JournalPage } from "../types";

interface SeekerJournalViewProps {
  pages: JournalPage[];
  onClose: () => void;
  onAddToCart?: (id: string) => void;
}

export default function SeekerJournalView({ pages, onClose, onAddToCart }: SeekerJournalViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => new Array(pages.length).fill(""));
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const journalRef = useRef<HTMLDivElement>(null);

  // Keep answers in sync safe without infinite loops
  const prevPagesLength = useRef(pages.length);
  if (prevPagesLength.current !== pages.length) {
    prevPagesLength.current = pages.length;
    setAnswers(new Array(pages.length).fill(""));
  }

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleDownload = async () => {
    const container = document.getElementById("pdf-export-container");
    if (!container) return;
    setIsGeneratingPdf(true);
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const children = Array.from(container.children);
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const canvas = await html2canvas(child, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fef9c3",
        });
        
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        const height = pdfWidth / ratio;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, height);
      }
      
      pdf.save("Pocket_Sanctuary_Transmissions.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-mystic-indigo flex flex-col font-sans overflow-hidden">
      {/* Hidden container for PDF capture of all pages */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div id="pdf-export-container">
          {pages.map((page, i) => (
            <div key={i} className="w-[800px] bg-[#fef9c3] p-20 flex flex-col min-h-[1100px] relative border-l-8 border-[#fef08a]">
              <div 
                className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] font-black whitespace-nowrap"
                style={{ color: "#DC26264D" }} // red-600 with 30% opacity
              >
                Transmitted Manifestation • Page {i + 1}
              </div>
              
              <div className="mt-20 text-center flex-1 flex flex-col justify-center items-center">
                 <Sparkles 
                   className="w-10 h-10 mx-auto mb-8" 
                   style={{ color: "#DC26264D" }}
                 />
                 
                 <div className="w-full bg-[#FFFFFF66] border border-[#DC26261A] p-16 rotate-1 shadow-sm max-w-2xl">
                    <p className="text-[#DC2626] text-[12px] uppercase tracking-[0.4em] font-black mb-6">Manifestation Inquiry</p>
                    <p className="text-[#991B1B] text-3xl font-serif italic mb-10 leading-relaxed font-bold">"{page.prompt}"</p>
                    <div className="text-[#991B1B] text-2xl font-serif italic border-t border-[#DC26261A] pt-10 text-left leading-relaxed">
                       {answers[i] || "Silence of the Soul"}
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-20 flex justify-between items-end">
                <div 
                  className="text-[10px] uppercase tracking-widest font-black"
                  style={{ color: "#DC262633" }} // red-600 with 20% opacity
                >
                   Sacred Artifact Registry: {Math.random().toString(36).substring(7).toUpperCase()}
                   <span className="ml-4 opacity-50">|| Layer: Negativity Removal active</span>
                </div>
                <div className="text-[#991B1B] font-serif italic opacity-40">Mystic Artifacts Sanctuary</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Header */}
      <header className="p-6 flex justify-between items-center text-aged-paper border-b border-sacred-gold/10">
        <button onClick={onClose} className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Exit Sanctuary
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sacred-gold text-[10px] uppercase tracking-[0.4em] font-black">Cleanse Your Souls</span>
          <span className="text-[8px] opacity-40 uppercase tracking-widest">Digital Devotion</span>
        </div>
        <div>
          {onAddToCart ? (
            <button 
              onClick={() => {
                onAddToCart("journal-20");
                setShowAddedToast(true);
                setTimeout(() => setShowAddedToast(false), 4500);
              }}
              className="px-4 py-2 bg-sacred-gold text-mystic-indigo text-[9px] uppercase tracking-widest font-black hover:bg-white transition-all shadow-md"
            >
              + Buy Premium ($19)
            </button>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-mystic-indigo/95 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key={currentPage}
              ref={journalRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-2xl bg-yellow-100 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.2)] p-12 md:p-20 relative overflow-hidden flex flex-col min-h-[600px]"
            >
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-red-600/20 text-[8px] uppercase tracking-[0.5em] font-black whitespace-nowrap">
                Phase {currentPage + 1}: Internal Alignment
              </div>

              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                   <Sparkles className="w-8 h-8 text-red-600/40 mx-auto" />
                </div>

                <div className="w-full bg-white/40 border border-red-600/5 p-8 md:p-12 rotate-1 shadow-sm">
                  <div className="flex flex-col items-center justify-center gap-3 mb-6">
                    <div className="flex items-center justify-center gap-3">
                      <PenTool className="w-6 h-6 text-red-600" />
                      <span className="text-base md:text-xl uppercase tracking-[0.3em] font-black text-red-600">The Soul Prompt</span>
                    </div>
                    <span className="text-sm md:text-lg font-bold text-red-700/80 tracking-widest uppercase">
                      Inquiry {currentPage + 1} of {pages.length}
                    </span>
                  </div>
                  <p className="text-red-800 text-2xl md:text-3xl font-serif italic mb-8 leading-relaxed font-bold">"{pages[currentPage]?.prompt}"</p>
                  
                  <textarea 
                    autoFocus
                    value={answers[currentPage]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[currentPage] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder="Type your manifestation here in red ink (metaphorically)..."
                    className="w-full bg-transparent border-b border-red-600/20 py-4 text-red-800 font-serif italic focus:border-red-600 outline-none text-xl placeholder:text-red-600/10 transition-all min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!answers[currentPage]?.trim()}
                  className="mt-12 w-full py-5 bg-red-800 text-yellow-100 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-red-900 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {currentPage === pages.length - 1 ? "Conclude Ritual" : "Next Illumination"} <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 max-w-md w-full p-8"
            >
              <div className="w-24 h-24 bg-sacred-gold/10 text-sacred-gold rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl text-aged-paper font-serif italic">Ritual Complete</h2>
                <p className="text-aged-paper/60 leading-relaxed text-xs italic font-serif">
                  Your transmissions have been energetically sealed. The foundational Cleanse Your Souls (Free Edition) PDF is ready for generation.
                </p>
              </div>

              {onAddToCart && (
                <div className="bg-white/5 border border-sacred-gold/20 p-5 rounded text-left space-y-2">
                  <h4 className="text-sacred-gold text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
                    Deepen Your Devotion
                  </h4>
                  <p className="text-[11px] text-aged-paper/70 leading-relaxed font-light">
                    Transform your practice with the complete **Premium 24-Page Personalized Edition**, custom inscribed with your Sacred Name.
                  </p>
                  <button
                    onClick={() => {
                      onAddToCart("journal-20");
                      setShowAddedToast(true);
                      setTimeout(() => setShowAddedToast(false), 4500);
                    }}
                    className="w-full py-3 bg-sacred-gold text-mystic-indigo text-[9px] uppercase tracking-widest font-black hover:bg-white transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Add Premium Journal ($19) to Cart
                  </button>
                </div>
              )}

      <button 
        onClick={handleDownload}
        disabled={isGeneratingPdf}
        className="w-full py-5 bg-mystic-indigo text-aged-paper border border-white/20 text-xs uppercase tracking-[0.2em] font-black shadow-2xl hover:bg-white hover:text-mystic-indigo transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isGeneratingPdf ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <Download className="w-5 h-5" />
        )}
        {isGeneratingPdf ? "Synthesizing Light..." : "Download Sealed PDF"}
      </button>
              <button 
                onClick={onClose}
                className="text-[10px] uppercase tracking-widest text-aged-paper/40 hover:text-aged-paper transition-colors"
              >
                Return to Digital Sanctuary
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Footer */}
      <div className="h-1 bg-white/5 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          className="h-full bg-sacred-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        />
      </div>

      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 z-[750] max-w-sm bg-aged-paper border-2 border-sacred-gold p-5 shadow-2xl rounded text-mystic-indigo"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-sacred-gold/10 text-sacred-gold rounded-full shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm italic font-bold">Premium Devotion Synced</h4>
                <p className="text-[10px] text-mystic-indigo/80 leading-relaxed mt-1">
                  The **24-Page Personalized Edition** has been successfully added to your Cart. Unlock your download after checkout.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
