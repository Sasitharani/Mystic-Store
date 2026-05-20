import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  Download, 
  Settings, 
  Eye, 
  ArrowLeft,
  Sparkles,
  BookOpen,
  Layout,
  Image as ImageIcon,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Trash2
} from "lucide-react";
import { useState } from "react";
import JournalWorkshop from "./JournalWorkshop";
import { JournalPage } from "../types";
import { Product, DEFAULT_ARTIFACT_PAGES } from "../constants";

interface AdminDashboardProps {
  onClose: () => void;
  pages: JournalPage[];
  setPages: (pages: JournalPage[]) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export default function AdminDashboard({ onClose, pages, setPages, products, setProducts }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "workshop" | "inventory" | "art_manifest">("overview");

  // AI Image Generator states
  const [selectedProductId, setSelectedProductId] = useState<string>("journal-free");
  const [aiPrompt, setAiPrompt] = useState<string>("A mystical glowing book radiating deep golden light, floating in a cosmic indigo workspace, sacred geometry, highly detailed oil painting style");
  const [currentSeed, setCurrentSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // States for Editing Individual Artifact Questions
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
  const [editingPages, setEditingPages] = useState<JournalPage[]>([]);
  const [currentEditingPageIdx, setCurrentEditingPageIdx] = useState<number>(0);
  const [editingWorkshopTab, setEditingWorkshopTab] = useState<"design" | "library">("design");
  const [isSavingArtifact, setIsSavingArtifact] = useState<boolean>(false);
  const [saveArtifactSuccess, setSaveArtifactSuccess] = useState<boolean>(false);

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

  const handleAdminSurpriseMe = async () => {
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
        const updated = editingPages.map((p, idx) => 
          idx === currentEditingPageIdx ? { ...p, prompt: data.question } : p
        );
        setEditingPages(updated);
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
      const updated = editingPages.map((p, idx) => 
        idx === currentEditingPageIdx ? { ...p, prompt: generated } : p
      );
      setEditingPages(updated);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleAdminRejectQuestion = () => {
    const currentPagePrompt = editingPages[currentEditingPageIdx]?.prompt;
    if (!currentPagePrompt) return;
    const rejected = getRejectedQuestions();
    if (!rejected.includes(currentPagePrompt)) {
      rejected.push(currentPagePrompt);
      localStorage.setItem("sacred_rejected_questions", JSON.stringify(rejected));
    }
    
    setRejectionFeedback("Question banished safely. Attuning next cosmic option...");
    setTimeout(() => {
      setRejectionFeedback(null);
    }, 4000);

    handleAdminSurpriseMe();
  };

  // Question Pool for Library integration
  const ARTIFACT_QUESTION_POOL = [
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
    "What promise have you made to yourself that you consistently break?",
    "What is the deepest desire you are currently censoring?",
    "What does your anger have to say, if it were allowed a voice?",
    "If your heart were an ancient library, which shelf needs dusting?"
  ];

  const getArtifactLimit = (id: string) => {
    if (id === "journal-free") return 3;
    if (id === "journal-20") return 20;
    if (id === "journal-50") return 50;
    return 100; // Legacy or others
  };

  const startEditingArtifact = (productId: string) => {
    const stored = localStorage.getItem(`mystic_artifact_pages_${productId}`);
    let loadedPages: JournalPage[] = [];
    if (stored) {
      try {
        loadedPages = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored artifact pages:", e);
      }
    }
    
    // Fall back to constants default pages
    if (!loadedPages || loadedPages.length === 0) {
      // Special check: if it is the free journal & we have current pages in state, use them
      if (productId === "journal-free" && pages && pages.length > 0) {
        loadedPages = pages;
      } else {
        loadedPages = DEFAULT_ARTIFACT_PAGES[productId] || [];
      }
    }

    setEditingArtifactId(productId);
    setEditingPages(loadedPages);
    setCurrentEditingPageIdx(0);
    setEditingWorkshopTab("design");
    setSaveArtifactSuccess(false);
  };

  const handleSealArtifact = () => {
    if (!editingArtifactId) return;
    setIsSavingArtifact(true);
    
    setTimeout(() => {
      // Direct save to localStorage so it never loses sync under any refresh
      localStorage.setItem(`mystic_artifact_pages_${editingArtifactId}`, JSON.stringify(editingPages));
      
      // Auto-sync free journal pages state to App.tsx so homepage is instantly live-synced
      if (editingArtifactId === "journal-free") {
        setPages(editingPages);
      }
      
      setIsSavingArtifact(false);
      setSaveArtifactSuccess(true);
      setTimeout(() => setSaveArtifactSuccess(false), 2000);
    }, 1500);
  };

  const addPageToEditing = () => {
    if (!editingArtifactId) return;
    const limit = getArtifactLimit(editingArtifactId);
    if (editingPages.length >= limit) return;

    const newPage: JournalPage = {
      id: editingPages.length + 1,
      title: "New Transmission",
      subtitle: "Sacred Mirroring",
      content: "Begin your writing here...",
      prompt: "What is the voice of your soul whispering?",
      aesthetic: "Choose mood"
    };

    setEditingPages([...editingPages, newPage]);
    setCurrentEditingPageIdx(editingPages.length);
  };

  const deleteEditingPage = () => {
    if (editingPages.length <= 1) return; // Must keep at least one
    const updated = editingPages
      .filter((_, idx) => idx !== currentEditingPageIdx)
      .map((p, idx) => ({ ...p, id: idx + 1 }));
    setEditingPages(updated);
    setCurrentEditingPageIdx(Math.max(0, currentEditingPageIdx - 1));
  };

  const addPageFromLibraryToEditing = (prompt: string) => {
    if (!editingArtifactId) return;
    const limit = getArtifactLimit(editingArtifactId);
    if (editingPages.length >= limit) return;

    const newPage: JournalPage = {
      id: editingPages.length + 1,
      title: "Soul Reflection",
      subtitle: "Internal Dialogue",
      content: "Quiet the mind and look within...",
      prompt,
      aesthetic: "Gold"
    };

    setEditingPages([...editingPages, newPage]);
    setEditingWorkshopTab("design");
    setCurrentEditingPageIdx(editingPages.length);
  };

  const stats = [
    { label: "Total Alignment (USD)", value: "$12,450", change: "+12%", icon: TrendingUp },
    { label: "Active Seekers", value: "1,204", change: "+5%", icon: Users },
    { label: "Artifact Transmissions", value: "840", change: "+20%", icon: Download },
  ];

  return (
    <div className="fixed inset-0 z-[500] bg-aged-paper overflow-hidden flex flex-col font-sans text-mystic-indigo">
      {/* Sidebar / Header */}
      <header className="bg-mystic-indigo text-aged-paper p-6 flex justify-between items-center border-b border-sacred-gold/20">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-sacred-gold" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-serif italic text-sacred-gold">Sanctuary Command</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Divine Mother's Dashboard</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 md:gap-8">
          {[
            { id: "overview", label: "Overview", icon: Layout },
            { id: "workshop", label: "Journal Workshop", icon: BookOpen },
            { id: "inventory", label: "Artifacts", icon: Settings },
            { id: "art_manifest", label: "AI Manifestation Room", icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "text-sacred-gold font-bold" : "opacity-40 hover:opacity-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sacred-gold/20 border border-sacred-gold flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sacred-gold" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 bg-mystic-indigo/5">
        {activeTab === "overview" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 border border-mystic-indigo/5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-mystic-indigo/5 text-mystic-indigo rounded-lg">
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-serif">{stat.value}</h3>
                </div>
              ))}
              <div className="bg-sacred-gold text-mystic-indigo p-6 shadow-xl">
                 <div className="flex justify-between items-start mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[8px] font-bold bg-white/20 px-2 py-0.5">NEW</span>
                 </div>
                 <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Top Tier Traction</p>
                 <h3 className="text-2xl font-serif">The Oracle (55%)</h3>
              </div>
            </div>

            {/* Artifact Readiness Overview */}
            <div className="bg-white p-8 border border-mystic-indigo/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif italic text-mystic-indigo/80">Workshop Readiness</h3>
                <div className="flex gap-4 text-[8px] uppercase tracking-widest font-bold">
                  <span className="text-sacred-gold">● Synchronized</span>
                  <span className="opacity-20 text-mystic-indigo">● Draft</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { name: "The Seeker (Free)", questions: pages.length, status: pages.length >= 3 ? "Complete" : "Draft", color: pages.length >= 3 ? "text-green-600" : "text-amber-600" },
                  { name: "Devotee Tier ($19)", questions: 20, status: "Review", color: "text-amber-600" },
                  { name: "Oracle Tier ($44)", questions: 50, status: "Draft", color: "text-mystic-indigo/40" },
                ].map((tier, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-2">{tier.name}</p>
                        <span className="text-3xl font-serif">{tier.questions}</span>
                        <span className="text-[10px] uppercase opacity-40 ml-2">Items</span>
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${tier.color}`}>{tier.status}</span>
                    </div>
                    <div className="h-1 bg-mystic-indigo/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${tier.status === "Complete" ? "bg-green-500" : (tier.status === "Draft" ? "bg-mystic-indigo/10" : "bg-amber-500")}`} 
                        style={{ width: tier.status === "Complete" ? "100%" : (tier.status === "Review" ? "60%" : "20%") }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal Tiers Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 border border-mystic-indigo/5 shadow-sm">
                <h3 className="text-xl font-serif italic mb-8 text-mystic-indigo/80">Tier Distribution</h3>
                <div className="space-y-6">
                  {[
                    { name: "The Seeker (Free)", count: 420, color: "bg-mystic-indigo/10", width: "w-full" },
                    { name: "The Path ($19)", count: 245, color: "bg-sacred-gold/40", width: "w-[60%]" },
                    { name: "The Oracle ($44)", count: 180, color: "bg-sacred-gold/70", width: "w-[45%]" },
                    { name: "The Legacy ($77)", count: 45, color: "bg-sacred-gold", width: "w-[15%]" },
                  ].map((tier, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest">
                        <span>{tier.name}</span>
                        <span className="opacity-40">{tier.count} Downloads</span>
                      </div>
                      <div className="h-2 bg-mystic-indigo/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: tier.width }}
                          className={`h-full ${tier.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalization Queue */}
              <div className="bg-white p-8 border border-mystic-indigo/5 shadow-sm">
                <h3 className="text-xl font-serif italic mb-8 text-mystic-indigo/80">Personalization Queue</h3>
                <div className="space-y-4">
                  {[
                    { id: "Q-104", name: "Elena Gilbert", tier: "The Oracle", status: "In Rendering" },
                    { id: "Q-105", name: "Marcus Aurelius", tier: "The Path", status: "Queued" },
                    { id: "Q-106", name: "Sofia Loren", tier: "The Oracle", status: "Queued" },
                  ].map((job, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-mystic-indigo/5 bg-mystic-indigo/5">
                      <div>
                        <p className="text-xs font-bold">{job.name}</p>
                        <p className="text-[10px] uppercase opacity-40 tracking-widest">{job.tier} • {job.id}</p>
                      </div>
                      <span className={`text-[8px] uppercase tracking-widest px-2 py-1 ${job.status === "In Rendering" ? "bg-sacred-gold text-mystic-indigo animate-pulse" : "bg-white/50"}`}>{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "workshop" && <JournalWorkshop pages={pages} setPages={setPages} />}
        
        {activeTab === "inventory" && (
          <div className="max-w-7xl mx-auto space-y-8">
            {!editingArtifactId ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-serif italic text-mystic-indigo">Digital Artifact Workshop</h2>
                    <p className="text-[10px] uppercase tracking-widest text-mystic-indigo/40 mt-1">
                      Choose any digital journal below to customize its internal transmissions and Soul-Deep Prompts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const pageCount = (() => {
                      const stored = localStorage.getItem(`mystic_artifact_pages_${product.id}`);
                      if (stored) {
                        try {
                          return JSON.parse(stored).length;
                        } catch (e) {}
                      }
                      return DEFAULT_ARTIFACT_PAGES[product.id]?.length || 0;
                    })();

                    return (
                      <div 
                        key={product.id} 
                        className="bg-white p-6 border border-mystic-indigo/5 shadow-sm hover:border-sacred-gold/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-full h-40 overflow-hidden mb-6 bg-mystic-indigo/5 relative">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex justify-between items-center z-10">
                              <span className="text-[8px] uppercase tracking-widest text-aged-paper bg-mystic-indigo/90 px-2 py-0.5 font-bold">
                                {product.fileFormat}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-serif italic text-mystic-indigo group-hover:text-sacred-gold transition-colors">{product.name}</h3>
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest opacity-40 mt-1 mb-4">
                            <span>{pageCount} Active Whispers</span>
                            <span>${product.price}</span>
                          </div>
                          <p className="text-xs text-mystic-indigo/60 line-clamp-2 mb-6">{product.description}</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (product.id) {
                              startEditingArtifact(product.id);
                            }
                          }}
                          className="w-full py-3 bg-mystic-indigo/5 hover:bg-mystic-indigo hover:text-white text-[10px] uppercase tracking-widest font-black transition-all border border-transparent cursor-pointer"
                        >
                          ✧ Edit Questions ✧
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Inside Artifact Workshop details (layout similar to JournalWorkshop) */
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row gap-12"
              >
                {/* Visual Workspace Column */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex flex-wrap justify-between items-center bg-white p-4 border border-mystic-indigo/5 gap-4">
                    <div className="flex items-center gap-4">
                      {/* Back button */}
                      <button 
                        onClick={() => setEditingArtifactId(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-mystic-indigo/5 hover:bg-mystic-indigo/10 text-[9px] uppercase tracking-widest font-bold text-mystic-indigo/80 transition-all"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Inventory
                      </button>
                      
                      <div className="flex bg-mystic-indigo/5 p-1 rounded-sm">
                        <button 
                          onClick={() => setEditingWorkshopTab("design")}
                          className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${editingWorkshopTab === "design" ? "bg-white text-mystic-indigo shadow-sm" : "text-mystic-indigo/40"}`}
                        >
                          Design Layout
                        </button>
                        <button 
                          onClick={() => setEditingWorkshopTab("library")}
                          className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${editingWorkshopTab === "library" ? "bg-white text-mystic-indigo shadow-sm" : "text-mystic-indigo/40"}`}
                        >
                          Inquiry Library
                        </button>
                      </div>

                      {editingWorkshopTab === "design" && editingPages.length > 0 && (
                        <div className="flex items-center gap-2 border-l border-mystic-indigo/10 pl-4">
                          <span className="font-serif italic text-sm text-mystic-indigo">
                            Whisper {currentEditingPageIdx + 1} of {editingPages.length}
                          </span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setCurrentEditingPageIdx(Math.max(0, currentEditingPageIdx - 1))}
                              className="p-1 hover:bg-mystic-indigo/5 disabled:opacity-20 transition-colors"
                              disabled={currentEditingPageIdx === 0}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setCurrentEditingPageIdx(Math.min(editingPages.length - 1, currentEditingPageIdx + 1))}
                              className="p-1 hover:bg-mystic-indigo/5 disabled:opacity-20 transition-colors"
                              disabled={currentEditingPageIdx === editingPages.length - 1}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={addPageToEditing}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-sacred-gold text-mystic-indigo text-[10px] uppercase font-bold hover:bg-white hover:text-mystic-indigo transition-colors border border-sacred-gold/30 shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> New Blank Page
                      </button>
                      
                      {editingPages.length > 1 && (
                        <button 
                          onClick={deleteEditingPage}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-[10px] uppercase font-bold hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                        >
                          <Trash2 className="w-3 h-3" /> Delete Page
                        </button>
                      )}
                    </div>
                  </div>

                  {editingWorkshopTab === "design" ? (
                    /* The Journal Page Preview - STICKY NOTE THEME */
                    <div className="flex-1 bg-yellow-100 rounded-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col p-12 md:p-16 min-h-[580px] border-l-8 border-yellow-200/50">
                      {/* Instruction Overlay */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-red-600/30 whitespace-nowrap">
                        <div className="h-[1px] w-8 bg-red-600/20" />
                        <span className="text-[9px] uppercase tracking-[0.5em] font-black">
                          SACRED INQUIRY • {products.find(p => p.id === editingArtifactId)?.name}
                        </span>
                        <div className="h-[1px] w-8 bg-red-600/20" />
                      </div>

                      {/* Animated Background Activities */}
                      <motion.div 
                        animate={{ 
                          rotate: [0, 90],
                          opacity: [0.05, 0.08, 0.05]
                        }}
                        transition={{ duration: 30, repeat: Infinity }}
                        className="absolute -top-48 -right-48 w-full h-full bg-sacred-gold/25 blur-[120px] rounded-full"
                      />

                      {editingPages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                          <BookOpen className="w-16 h-16 text-red-850" />
                          <p className="text-sm uppercase tracking-widest font-bold font-serif mt-4">Empty Vessel</p>
                          <p className="text-xs max-w-xs mt-2">Initialize pages to begin designing your questions.</p>
                        </div>
                      ) : (
                        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="mb-4">
                            <div className="w-10 h-10 border border-red-600/10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Sparkles className="w-4 h-4 text-red-600/40" />
                            </div>
                            <span className="text-[8px] uppercase tracking-[0.4em] text-red-600/40 font-black">Sacred Mirroring Active</span>
                          </div>

                          <div className="w-full max-w-lg bg-white/40 backdrop-blur-xs border border-red-600/5 p-10 md:p-14 shadow-xs rotate-[0.5deg]">
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <PenTool className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-red-600 font-sans">The Manifestation Prompt</span>
                            </div>
                            <p className="text-red-800 text-3xl md:text-4xl font-serif italic mb-8 leading-relaxed">
                              {editingPages[currentEditingPageIdx]?.prompt || "Formulate an introspective prompt..."}
                            </p>
                            <div className="h-[1px] bg-red-600/15" />
                            <div className="flex justify-between items-center text-[7px] uppercase tracking-widest text-red-600/40 font-black mt-4">
                              <span>Mothers Sanctuary Code Layer</span>
                              <span className="text-red-600 flex items-center gap-1 font-sans">
                                <span className="w-1 h-1 bg-red-600 rounded-full" /> USE RED INK ONLY
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Question List View */
                    <div className="flex-1 bg-white p-8 border border-mystic-indigo/5 space-y-8 overflow-y-auto min-h-[580px]">
                      <div className="space-y-2">
                        <h3 className="text-xl font-serif italic text-mystic-indigo">Universal inquiry Pool</h3>
                        <p className="text-xs text-mystic-indigo/40 uppercase tracking-widest">
                          Choose an inquiry to weave into your current artifact. These are designed to harmonize with your inner frequency.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ARTIFACT_QUESTION_POOL.map((q, i) => (
                          <div 
                            key={i} 
                            className="p-5 bg-yellow-50/50 border border-yellow-200/50 hover:border-sacred-gold transition-all duration-300 flex flex-col justify-between group h-40"
                          >
                            <p className="text-red-800 font-serif italic text-base leading-relaxed line-clamp-3">"{q}"</p>
                            <button 
                              onClick={() => addPageFromLibraryToEditing(q)}
                              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-sacred-gold group-hover:text-mystic-indigo transition-all cursor-pointer"
                            >
                              Integrate into Vault <Plus className="w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Column */}
                <aside className="w-full lg:w-96 flex flex-col gap-6">
                  {/* limits block */}
                  <div className="bg-white p-6 border border-mystic-indigo/5 space-y-4 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-mystic-indigo/50 border-b border-mystic-indigo/5 pb-2">
                      Artifact Tier Capacity
                    </h4>
                    <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                      <span className="opacity-60">Selected Product:</span>
                      <span className="font-serif italic text-sacred-gold font-bold">
                        {products.find(p => p.id === editingArtifactId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                      <span className="opacity-60">Total Pages:</span>
                      <span className="font-bold">
                        {editingPages.length} / {getArtifactLimit(editingArtifactId)} Limit
                      </span>
                    </div>

                    <div className="h-1.5 bg-mystic-indigo/5 w-full">
                      <div 
                        className={`h-full transition-all duration-500 bg-sacred-gold`}
                        style={{ width: `${Math.min(100, (editingPages.length / getArtifactLimit(editingArtifactId)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {editingPages.length > 0 && (
                    <div className="bg-white p-8 border border-mystic-indigo/5 space-y-6 shadow-sm">
                      <div className="flex items-center gap-3 border-b border-mystic-indigo/5 pb-4">
                        <PenTool className="w-5 h-5 text-sacred-gold" />
                        <h4 className="text-xs uppercase tracking-widest font-black text-mystic-indigo">Workshop Tools</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Soul-Deep Prompt</label>
                            <button 
                              type="button"
                              onClick={handleAdminSurpriseMe}
                              disabled={isGeneratingPrompt}
                              className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-black text-red-650 hover:text-red-800 disabled:opacity-50 transition-colors cursor-pointer group"
                            >
                              <Sparkles className={`w-3 h-3 group-hover:rotate-12 transition-transform ${isGeneratingPrompt ? 'animate-spin text-sacred-gold' : ''}`} /> {isGeneratingPrompt ? "Attuning..." : "✧ Surprise Me"}
                            </button>
                          </div>
                          <textarea 
                            rows={4}
                            value={editingPages[currentEditingPageIdx]?.prompt || ""}
                            onChange={(e) => {
                              const updated = editingPages.map((p, idx) => 
                                idx === currentEditingPageIdx ? { ...p, prompt: e.target.value } : p
                              );
                              setEditingPages(updated);
                            }}
                            disabled={isGeneratingPrompt}
                            className={`w-full bg-mystic-indigo/5 p-4 text-sm focus-within:border-sacred-gold outline-none border-b border-transparent focus:bg-white transition-all text-red-850 font-serif italic resize-none ${isGeneratingPrompt ? 'opacity-50 select-none' : ''}`}
                            placeholder="The question they must face..."
                          />

                          <div className="flex justify-between items-center text-xs bg-mystic-indigo/5 px-2.5 py-2 border border-mystic-indigo/10 mt-2">
                            <div className="flex items-center gap-2 font-mono text-xs text-mystic-indigo/60">
                              <span className="font-bold">Inquiry No. {currentQuestionNo}</span>
                              <span>•</span>
                              <span>{Math.max(0, 150 - getRejectedQuestions().length)} Remaining</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isGeneratingPrompt && (
                                <span className="text-sacred-gold animate-pulse uppercase tracking-wider font-bold mr-2">Refining Internet Frequency...</span>
                              )}
                              <button 
                                type="button"
                                onClick={handleAdminRejectQuestion}
                                disabled={!editingPages[currentEditingPageIdx]?.prompt || isGeneratingPrompt}
                                className="flex items-center gap-1 uppercase tracking-widest font-black text-mystic-indigo/50 hover:text-red-750 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Reject and banish this prompt so it never appears again in Admin"
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
                                className="p-2.5 bg-red-50 border border-red-200/50 text-red-800 text-xs uppercase tracking-widest font-black text-center mt-2"
                              >
                                {rejectionFeedback}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <button 
                          onClick={handleSealArtifact}
                          disabled={isSavingArtifact}
                          className="w-full py-5 bg-mystic-indigo text-aged-paper text-[10px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 hover:bg-sacred-gold hover:text-mystic-indigo transition-all shadow-xl disabled:opacity-50 relative overflow-hidden cursor-pointer"
                        >
                          {isSavingArtifact ? (
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-4 h-4 text-sacred-gold" />
                            </motion.div>
                          ) : saveArtifactSuccess ? (
                            <span className="flex items-center gap-2">
                              Transmitted Successfully <Sparkles className="w-3 h-3" />
                            </span>
                          ) : (
                            <>
                              <Send className="w-4 h-4" /> Seal & Transmit Repository
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </aside>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "art_manifest" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-12"
          >
            <div className="bg-white p-8 border border-mystic-indigo/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-mystic-indigo/5 pb-4">
                <Sparkles className="w-6 h-6 text-sacred-gold" />
                <div>
                  <h3 className="text-2xl font-serif italic text-mystic-indigo">AI Art Manifestation Chamber</h3>
                  <p className="text-xs text-mystic-indigo/60 uppercase tracking-widest mt-1">
                    Connect thought-forms to physical realities using the Pollinations AI generator. Confirm to instantly update the homepage blocks!
                  </p>
                </div>
              </div>

              {/* Grid of 4 Blocks */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold block">
                  Step 1: Choose Block Target
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.filter(p => p.category === "Digital Journals").map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setIsConfirmed(false);
                      }}
                      className={`flex flex-col text-left p-4 border transition-all relative cursor-pointer ${
                        selectedProductId === p.id 
                          ? "border-sacred-gold bg-sacred-gold/5" 
                          : "border-mystic-indigo/10 hover:border-mystic-indigo/30 bg-mystic-indigo/5"
                      }`}
                    >
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-sacred-gold bg-mystic-indigo px-2 py-0.5 rounded-full">
                        Block {idx + 1}
                      </span>
                      <div className="w-12 h-16 mb-3 rounded overflow-hidden">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover grayscale-[20%]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="font-serif italic text-sm text-mystic-indigo line-clamp-1">{p.name}</h4>
                      <span className="text-[9px] uppercase tracking-widest text-mystic-indigo/40 mt-1">Current Art</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt box & Preset style chips */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-mystic-indigo/5">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-60 font-bold flex justify-between">
                      <span>Step 2: Enter Manifestation Prompt</span>
                      <span className="text-sacred-gold">Seed: {currentSeed}</span>
                    </label>
                    <textarea
                      rows={4}
                      value={aiPrompt}
                      onChange={(e) => {
                        setAiPrompt(e.target.value);
                        setIsConfirmed(false);
                      }}
                      className="w-full bg-mystic-indigo/5 p-4 text-sm focus:border-sacred-gold outline-none border border-mystic-indigo/15 focus:bg-white transition-all text-mystic-indigo font-serif placeholder-mystic-indigo/35"
                      placeholder="E.g., An ancient gold book hovering..."
                    />
                  </div>

                  {/* Aesthetic Suggestions */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold block">Aesthetic Suggestion Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { 
                          label: "Ancient Oracle", 
                          prompt: "A mystical, ancient leather-bound book radiating safe golden energy, floating in a dark cosmic nebula, sacred geometry designs, realistic oil painting style, highly detailed" 
                        },
                        { 
                          label: "Temple Introspection", 
                          prompt: "An elegant golden altar inside a serene ancient temple with candlelight, water reflection, soft twilight mist, professional digital concept art" 
                        },
                        { 
                          label: "Purification Shield", 
                          prompt: "A high-frequency shield of white and gold light crystals, purifying all negative dust particles, spiritual transmutation artwork, dark background" 
                        },
                        { 
                          label: "Cosmic Lineage Roots", 
                          prompt: "A glowing golden lotus seed floating over roots of deep space, family lineage spiritual art, ancestral healing, dark indigo aesthetics" 
                        }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setAiPrompt(item.prompt);
                            setIsConfirmed(false);
                          }}
                          className="px-3 py-1.5 bg-mystic-indigo/5 hover:bg-sacred-gold/10 hover:text-sacred-gold text-[9px] uppercase tracking-widest transition-colors border border-mystic-indigo/10 cursor-pointer"
                        >
                          ✧ {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={() => {
                      setIsGenerating(true);
                      setIsConfirmed(false);
                      const seed = Math.floor(Math.random() * 1000000);
                      setCurrentSeed(seed);
                      
                      const steps = [
                        "Purifying background negativity...",
                        "Syncing with Pollinations neural grid...",
                        "Filtering digital color waves...",
                        "Fusing cosmic golden geometry...",
                        "Finalizing spiritual resolution..."
                      ];
                      
                      let stepIndex = 0;
                      setGenerationStep(steps[0]);
                      
                      const intervalId = setInterval(() => {
                        stepIndex++;
                        if (stepIndex < steps.length) {
                          setGenerationStep(steps[stepIndex]);
                        } else {
                          clearInterval(intervalId);
                        }
                      }, 600);

                      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=850&height=850&seed=${seed}&nologo=true`;
                      
                      // Pre-load image so it is fully rendered when set
                      const tempImg = new Image();
                      tempImg.src = url;
                      tempImg.onload = () => {
                        setGeneratedUrl(url);
                        clearInterval(intervalId);
                        setIsGenerating(false);
                      };
                    }}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full py-4 bg-mystic-indigo text-aged-paper hover:bg-sacred-gold hover:text-mystic-indigo transition-all text-xs font-bold uppercase tracking-[0.2em] shadow-lg disabled:opacity-40 cursor-pointer"
                  >
                    {isGenerating ? "Manifesting Vibrational Art..." : "Vibrate Frequencies & Manifest Image"}
                  </button>
                </div>

                {/* Preview and Confirm Area */}
                <div className="flex flex-col items-center justify-center border border-mystic-indigo/10 bg-mystic-indigo/5 p-8 relative min-h-[350px]">
                  {isGenerating ? (
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-sacred-gold border-t-transparent rounded-full animate-spin mx-auto animate-pulse" />
                      <p className="text-xs uppercase tracking-widest text-sacred-gold font-bold animate-pulse">
                        {generationStep}
                      </p>
                    </div>
                  ) : generatedUrl ? (
                    <div className="w-full flex flex-col items-center space-y-6 animate-fadeIn">
                      <div className="w-64 h-64 shadow-xl border border-sacred-gold/30 rounded overflow-hidden bg-white">
                        <img
                          src={generatedUrl}
                          alt="AI generated manifestation"
                          className="w-full h-full object-cover animate-pulse-subtle"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-mystic-indigo/40 uppercase tracking-widest mb-4">
                          Frequencies fully aligned and materialized
                        </p>
                        
                        {!isConfirmed ? (
                          <button
                            onClick={() => {
                              // apply to products
                              const updated = products.map((prod) => {
                                if (prod.id === selectedProductId) {
                                  return { ...prod, image: generatedUrl };
                                }
                                return prod;
                              });
                              setProducts(updated);
                              setIsConfirmed(true);
                            }}
                            className="px-8 py-3 bg-sacred-gold text-mystic-indigo text-[10px] uppercase font-black tracking-widest hover:bg-white transition-colors shadow-lg border border-sacred-gold cursor-pointer"
                          >
                            ✧ Confirm Reflection to Main Page
                          </button>
                        ) : (
                          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-sm">
                            <p className="text-xs font-bold uppercase tracking-widest">
                              ✓ Art Successfully Infused!
                            </p>
                            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-80">
                              This image has been live sync'd and is now active on the homepage!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 opacity-30">
                      <ImageIcon className="w-12 h-12 mx-auto" />
                      <p className="text-xs uppercase tracking-widest font-bold">Awaiting Art Manifestation</p>
                      <p className="text-[10px] uppercase tracking-widest font-serif max-w-sm mx-auto">
                        Select a target block, refine your prompt, and trigger manifestation to view the materialization here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
