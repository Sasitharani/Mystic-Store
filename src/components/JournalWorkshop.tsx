import { motion, AnimatePresence } from "motion/react";
import { 
  PenTool, 
  Sparkles, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  BookOpen,
  Send,
  Layout
} from "lucide-react";
import { useState } from "react";
import { JournalPage } from "../types";

const QUESTION_POOL = [
  "What is the one truth you are afraid to tell yourself?",
  "Whose validation are you still seeking, even in their absence?",
  "If your inner child spoke today, child, what would they say?",
  "What burden are you carrying that was never yours to bear?",
  "In the silence of the night, what does your soul whisper?",
  "What part of your light have you dimmed to make others comfortable?",
  "If you were already successful, how would you walk through the room?",
  "What is the first thing you would do if fear wasn't an option?",
  "Who did you have to become to survive?",
  "Who would you be if you didn't have to survive anymore?",
];

interface JournalWorkshopProps {
  pages: JournalPage[];
  setPages: (pages: JournalPage[]) => void;
}

export default function JournalWorkshop({ pages, setPages }: JournalWorkshopProps) {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeWorkshopTab, setActiveWorkshopTab] = useState<"design" | "library">("design");
  const [isSealing, setIsSealing] = useState(false);
  const [sealSuccess, setSealSuccess] = useState(false);
  
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState<string | null>(null);
  const [currentQuestionNo, setCurrentQuestionNo] = useState(() => {
    try {
      const stored = localStorage.getItem("sacred_current_question_no");
      return stored ? parseInt(stored) : 1;
    } catch {
      return 1;
    }
  });

  const getRejectedQuestions = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem("sacred_rejected_questions") || "[]");
    } catch {
      return [];
    }
  };

  const handleSurpriseMe = async () => {
    setIsGeneratingPrompt(true);
    setRejectionFeedback(null);
    const rejected = getRejectedQuestions();
    
    // Increment question count
    const nextNo = currentQuestionNo + 1;
    setCurrentQuestionNo(nextNo);
    localStorage.setItem("sacred_current_question_no", String(nextNo));
    
    try {
      const res = await fetch("/api/surprise-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectedQuestions: rejected })
      });
      const data = await res.json();
      if (data.question) {
        const newPages = pages.map((p, idx) => 
          idx === currentPageIdx ? { ...p, prompt: data.question } : p
        );
        setPages(newPages);
      }
    } catch (e) {
      console.error("Failed to fetch custom question, falling back to offline pool", e);
      const localPool = [
        "What is your biggest fear right now?",
        "What do you need to say no to today?",
        "What made you smile today?",
        "What are you hiding from yourself?",
        "What did you learn about yourself today?"
      ];
      const generated = localPool[Math.floor(Math.random() * localPool.length)];
      const newPages = pages.map((p, idx) => 
        idx === currentPageIdx ? { ...p, prompt: generated } : p
      );
      setPages(newPages);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleRejectQuestion = () => {
    if (!currentPage?.prompt) return;
    const currentPrompt = currentPage.prompt;
    const rejected = getRejectedQuestions();
    if (!rejected.includes(currentPrompt)) {
      rejected.push(currentPrompt);
      localStorage.setItem("sacred_rejected_questions", JSON.stringify(rejected));
    }
    
    setRejectionFeedback("Question banished safely. Attuning next cosmic option...");
    setTimeout(() => {
      setRejectionFeedback(null);
    }, 4000);

    handleSurpriseMe();
  };

  const currentPage = pages[currentPageIdx];

  const AI_SUGGESTIONS = [
    {
      title: "The Silent Garden",
      content: "Within you lies a garden of forgotten dreams. The path is always open, waiting for your presence. Your silence is not empty; it is a full vessel of your own becoming.",
      prompt: "What is one dream you buried to survive the winter of your life?"
    },
    {
      title: "The Mirror of Awareness",
      content: "You see flaws where life sees history. Every scar is a map of where you chose to keep breathing when the air felt heavy. Look deeper into your own light.",
      prompt: "If awareness was a color, how would it paint your reflection today?"
    },
    {
      title: "The Unspoken Anchor",
      content: "The lineage is a chain until it is realized as a root. You are the blooming edge of a long-hidden flower. Let the weight steady you, as you anchor into your own truth.",
      prompt: "Whose hand do you feel on your shoulder when you stand tallest?"
    }
  ];

  const generateSeekerTier = () => {
    const seekerPages: JournalPage[] = AI_SUGGESTIONS.map((s, i) => ({
      id: i + 1,
      title: s.title,
      subtitle: `Seeker Transmission ${i + 1}`,
      content: s.content,
      prompt: s.prompt,
      aesthetic: "Gold"
    }));
    setPages(seekerPages);
    setCurrentPageIdx(0);
  };

  const handleSeal = () => {
    setIsSealing(true);
    setTimeout(() => {
      setIsSealing(false);
      setSealSuccess(true);
      setTimeout(() => setSealSuccess(false), 3000);
    }, 2000);
  };

  const addPageFromLibrary = (prompt: string) => {
    const newPage: JournalPage = {
      id: pages.length + 1,
      title: "Soul Prompt",
      subtitle: "Internal Inquiry",
      content: "Your inner wisdom asks...",
      prompt,
      aesthetic: "Gold"
    };
    setPages([...pages, newPage]);
    setActiveWorkshopTab("design");
    setCurrentPageIdx(pages.length);
  };

  const addPage = () => {
    const newPage: JournalPage = {
      id: pages.length + 1,
      title: "New Transmission",
      subtitle: "Enter subtitle",
      content: "Begin your writing...",
      prompt: "Add a soul-searching prompt...",
      aesthetic: "Choose mood"
    };
    setPages([...pages, newPage]);
    setCurrentPageIdx(pages.length);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 h-full">
      {/* Visual Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-4 border border-mystic-indigo/5 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-mystic-indigo/5 p-1 rounded-lg">
              <button 
                onClick={() => setActiveWorkshopTab("design")}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeWorkshopTab === "design" ? "bg-white text-mystic-indigo shadow-sm" : "text-mystic-indigo/40"}`}
              >
                Layout Editor
              </button>
              <button 
                onClick={() => setActiveWorkshopTab("library")}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeWorkshopTab === "library" ? "bg-white text-mystic-indigo shadow-sm" : "text-mystic-indigo/40"}`}
              >
                Question Library
              </button>
            </div>
            {activeWorkshopTab === "design" && (
              <div className="flex items-center gap-2 border-l border-mystic-indigo/10 pl-4">
                <h2 className="font-serif italic text-sm text-mystic-indigo">Page {currentPageIdx + 1}/{pages.length}</h2>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentPageIdx(Math.max(0, currentPageIdx - 1))}
                    className="p-1 hover:bg-mystic-indigo/5 disabled:opacity-20 transition-colors"
                    disabled={currentPageIdx === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPageIdx(Math.min(pages.length - 1, currentPageIdx + 1))}
                    className="p-1 hover:bg-mystic-indigo/5 disabled:opacity-20 transition-colors"
                    disabled={currentPageIdx === pages.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={addPage}
              className="flex items-center gap-2 px-4 py-1.5 bg-sacred-gold text-mystic-indigo text-[10px] uppercase font-bold hover:bg-white transition-colors border border-sacred-gold shadow-sm"
            >
              <Plus className="w-3 h-3" /> New Blank Page
            </button>
          </div>
        </div>

        {activeWorkshopTab === "design" ? (
          /* The Journal Page Preview - STICKY NOTE THEME */
          <div className="flex-1 bg-yellow-100 rounded-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col p-16 min-h-[700px] border-l-8 border-yellow-200/50">
          {/* Instruction Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-red-600/30 whitespace-nowrap">
             <div className="h-[1px] w-8 bg-red-600/20" />
             <span className="text-[9px] uppercase tracking-[0.5em] font-black">Sacred Instruction: One Paper, One Question</span>
             <div className="h-[1px] w-8 bg-red-600/20" />
          </div>

          {/* Animated Background Artifacts */}
          <motion.div 
            animate={{ 
              rotate: [0, 90],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute -top-48 -right-48 w-full h-full bg-sacred-gold/30 blur-[150px] rounded-full"
          />
          
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
               <div className="w-12 h-12 border border-red-600/10 rounded-full flex items-center justify-center mx-auto mb-2">
                 <Sparkles className="w-5 h-5 text-red-600/40" />
               </div>
               <span className="text-[10px] uppercase tracking-[0.6em] text-red-600/40 font-black">Sacred Instruction: One Paper, One Question</span>
            </div>

            <div className="w-full max-w-lg bg-white/40 backdrop-blur-sm border border-red-600/5 p-12 shadow-sm rotate-1">
              <div className="flex items-center justify-center gap-3 mb-8">
                <PenTool className="w-4 h-4 text-red-600" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-red-600">The Manifestation Prompt</span>
              </div>
              <p className="text-red-800 text-3xl md:text-4xl font-serif italic mb-12 leading-relaxed">
                {currentPage?.prompt || "Formulate an introspective prompt..."}
              </p>
              
              <div className="space-y-4">
                <div className="h-[1px] bg-red-600/10" />
                <div className="flex justify-between items-center px-2">
                  <span className="text-[8px] uppercase tracking-widest text-red-600/40 font-black">Faster Manifestation Protocol:</span>
                  <span className="text-[8px] uppercase tracking-widest text-red-600 font-black flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> USE RED INK ONLY
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 text-yellow-900/10 rotate-12">
            <BookOpen className="w-32 h-32" />
          </div>
        </div>
        ) : (
          /* Question Library View */
          <div className="flex-1 bg-white p-8 border border-mystic-indigo/5 space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-mystic-indigo">Universal Inquiry Pool</h3>
              <p className="text-xs text-mystic-indigo/40 uppercase tracking-widest leading-relaxed">
                Choose an inquiry to weave into your current artifact. These are designed to harmonize with your inner frequency.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTION_POOL.map((q, i) => (
                <div key={i} className="p-6 bg-yellow-50 border border-yellow-200/50 hover:border-sacred-gold transition-all group flex flex-col justify-between h-48">
                  <p className="text-red-800 font-serif italic text-lg leading-relaxed line-clamp-3">"{q}"</p>
                  <button 
                    onClick={() => addPageFromLibrary(q)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-sacred-gold group-hover:text-mystic-indigo transition-colors"
                  >
                    Integrate into Vault <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-mystic-indigo/5">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-mystic-indigo mb-6 opacity-40">Tier Assembly Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Seeker (Free)", current: pages.length, max: 3, label: "Questions" },
                  { name: "Devotee ($19)", current: pages.length, max: 20, label: "Questions" },
                  { name: "Oracle ($44)", current: pages.length, max: 50, label: "Questions" },
                ].map((tier, i) => (
                  <div key={i} className="p-4 bg-mystic-indigo/5 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-mystic-indigo">{tier.name}</p>
                    <div className="h-1.5 bg-mystic-indigo/10 w-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${tier.current > tier.max ? "bg-red-500" : "bg-sacred-gold"}`}
                        style={{ width: `${Math.min(100, (tier.current / tier.max) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] uppercase font-bold opacity-40">
                      <span>{tier.current}/{tier.max}</span>
                      <span>{tier.current > tier.max ? "Limit Exceeded" : "Capacity"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Sidebar */}
      <aside className="w-full lg:w-96 flex flex-col gap-8 overflow-y-auto max-h-full pr-4 custom-scrollbar">
        <div className="bg-white p-8 border border-mystic-indigo/5 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-mystic-indigo/5 pb-4">
            <Layout className="w-5 h-5 text-sacred-gold" />
            <h4 className="text-xs uppercase tracking-widest font-black text-mystic-indigo">Workshop Tools</h4>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Artifact Tier Assignment</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Seeker", max: 3, action: generateSeekerTier },
                { name: "Devotee", max: 20, action: () => {} },
                { name: "Oracle", max: 50, action: () => {} },
              ].map(t => (
                <button 
                  key={t.name} 
                  onClick={t.action}
                  className={`py-3 text-[8px] uppercase tracking-widest transition-all font-black border flex flex-col items-center gap-1 ${pages.length > t.max ? 'opacity-20 cursor-not-allowed border-mystic-indigo/5' : 'hover:border-sacred-gold border-transparent bg-mystic-indigo/5'}`}
                >
                  <span>{t.name}</span>
                  <span className="opacity-40 text-[7px]">{t.max} Max</span>
                </button>
              ))}
            </div>
            {pages.length > 3 && <p className="text-[8px] text-red-500 uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" /> Exceeds Seeker (Free) limits
            </p>}
          </div>

          <div className="space-y-4 pt-4 border-t border-mystic-indigo/5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Soul-Deep Prompt</label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={handleSurpriseMe}
                    disabled={isGeneratingPrompt}
                    className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-black text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors group cursor-pointer"
                  >
                    <Sparkles className={`w-3 h-3 group-hover:rotate-12 transition-transform ${isGeneratingPrompt ? 'animate-spin text-sacred-gold' : ''}`} /> {isGeneratingPrompt ? "Attuning..." : "Surprise Me"}
                  </button>
                </div>
              </div>
              <textarea 
                rows={5}
                value={currentPage?.prompt}
                onChange={(e) => {
                  const newPages = pages.map((p, idx) => 
                    idx === currentPageIdx ? { ...p, prompt: e.target.value } : p
                  );
                  setPages(newPages);
                }}
                disabled={isGeneratingPrompt}
                className={`w-full bg-mystic-indigo/5 p-4 text-sm focus:border-sacred-gold outline-none border-b-2 border-transparent focus:bg-white transition-all text-red-800 font-serif italic resize-none overflow-y-auto ${isGeneratingPrompt ? 'opacity-50 select-none' : ''}`}
                placeholder="The question they must face..."
              />
              
              <div className="flex justify-between items-center text-xs bg-mystic-indigo/5 px-2.5 py-2 border border-mystic-indigo/10">
                <div className="flex items-center gap-2 font-mono text-xs text-mystic-indigo/60">
                  <span className="font-bold">Inquiry No. {currentQuestionNo}</span>
                  <span>•</span>
                  <span>{Math.max(0, 150 - getRejectedQuestions().length)} Remaining</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {isGeneratingPrompt && (
                    <span className="text-sacred-gold animate-pulse uppercase tracking-wider font-bold mr-2">Fusing Internet Frequency...</span>
                  )}
                  <button 
                    type="button"
                    onClick={handleRejectQuestion}
                    disabled={!currentPage?.prompt || isGeneratingPrompt}
                    className="flex items-center gap-1 uppercase tracking-widest font-black text-mystic-indigo/50 hover:text-red-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Reject and banish this prompt so it never appears again"
                  >
                    Reject Question ✕
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {rejectionFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-2.5 bg-red-50 border border-red-200/50 text-red-800 text-xs uppercase tracking-widest font-black text-center"
                  >
                    {rejectionFeedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleSeal}
            disabled={isSealing}
            className="w-full py-5 bg-mystic-indigo text-aged-paper text-[10px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 hover:bg-sacred-gold hover:text-mystic-indigo transition-all shadow-xl group relative overflow-hidden"
          >
            {isSealing ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : sealSuccess ? (
              <span className="flex items-center gap-2">
                Transmitted <Sparkles className="w-3 h-3" />
              </span>
            ) : (
              <>
                <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Seal and Transmit Repository
              </>
            )}
            {isSealing && (
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-sacred-gold/20"
              />
            )}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200/60 p-8 text-yellow-900 space-y-4 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200/50 blur-2xl rounded-full -mr-12 -mt-12" />
           <div className="flex items-center gap-2 relative z-10">
             <Sparkles className="w-5 h-5 text-red-600/40" />
             <h4 className="text-[10px] uppercase tracking-widest font-black">Manifestation Note</h4>
           </div>
           <p className="text-xs italic leading-relaxed relative z-10 font-serif">
             "Red ink vibrates with the heart center. By requiring seekers to use it on individual yellow sheets, we force mindful focus. One paper, one intention. This is the secret of the Pocket Sanctuary."
           </p>
        </div>
      </aside>
    </div>
  );
}
