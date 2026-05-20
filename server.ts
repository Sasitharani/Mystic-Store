import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const SIMPLE_QUESTIONS = [
  "What is the biggest fear you are carrying today?",
  "What boundary do you need to set right now?",
  "What are you holding onto that you should let go?",
  "What made you feel truly alive today?",
  "What are you trying to hide from yourself?",
  "What does peace feel like to you in this moment?",
  "Who do you need to forgive today?",
  "What are you avoiding by staying busy?",
  "What part of your past is still holding you back?",
  "What promise did you break to yourself today?",
  "What does your body need right now?",
  "When was the last time you felt truly safe?",
  "What is the one truth you are avoiding?",
  "What makes you feel most loved?",
  "What makes you feel proud of yourself today?",
  "What are you holding back from saying out loud?",
  "What is draining your energy the most today?",
  "What is the kindest thing you can do for yourself?",
  "Who are you trying so hard to please?",
  "What draft of your life are you currently writing?",
  "What is your heart trying to tell you?",
  "What is the strongest emotion in you right now?",
  "What makes you feel absolutely secure?",
  "What did you learn about yourself today?",
  "What are you most grateful for right now?",
  "What habit is keeping you stuck in the past?",
  "What does your inner child want to hear?",
  "What does freedom look like to you today?",
  "What simple thing brought you joy today?",
  "What are you letting define your worth?",
  "What are you most excited for tomorrow?",
  "What can you do to be more gentle with yourself?",
  "What worry is keeping you awake tonight?",
  "What represents your truest self?",
  "What is worth fighting for in your life?",
  "What is the biggest lesson you learned this week?",
  "What makes you feel like you belong?",
  "What are you ready to say yes to?",
  "What is the best version of your future self like?",
  "What can you control today, and what must you surrender?",
  "What silent protector from your childhood still guides you?",
  "What does success mean to you outside of work?",
  "What makes you feel deeply connected to others?",
  "What is the most beautiful thing you saw today?",
  "What quiet dream are you keeping secret?",
  "What is holding you back from speaking your truth?",
  "What feeling are you trying not to feel?",
  "What does unconditional love mean to you?",
  "What represents home to you?",
  "What makes you feel truly inspired?",
  "What is the most honest thought you had today?",
  "What are you waiting for to start living?",
  "What is the biggest risk you want to take?",
  "What makes you feel most at peace?",
  "What do you need to say no to today?",
  "What are you most proud of having survived?",
  "What is the most meaningful promise you ever kept?",
  "What part of your daily routine brings you comfort?",
  "What memory always makes you smile?",
  "What are you letting go of to make room for growth?",
  "What does a perfect day of rest look like?",
  "What represents safety to you right now?",
  "What makes you feel incredibly strong?",
  "What are you most impatient about?",
  "What part of your personality do you love most?",
  "What is a soft truth about your life?",
  "What simple gift did you receive today?",
  "What noise are you trying to drown out?",
  "What makes you feel deeply valued?",
  "What is your favorite way to express creativity?",
  "What does healing feel like to you today?",
  "What fear is currently shrinking your world?",
  "What do you need to hear when you feel low?",
  "What is your highest priority for tomorrow?",
  "What simple luxury are you grateful for?",
  "What is a dream you haven't told anyone?",
  "What makes you feel the most authentic?",
  "What heavy burden did you finally lay down?",
  "What does your silence say about you?",
  "What represents the start of a new chapter?",
  "What are you most compassionate toward today?",
  "What pattern do you want to break today?",
  "What is the kindest comment someone made to you?",
  "What part of your childhood do you miss most?",
  "What is the most grounding habit you have?",
  "What makes you feel completely understood?",
  "What does your current frequency need?",
  "What keeps you anchored during a storm?",
  "What are you holding in your closed fist?",
  "Who inspires you to be a better person?",
  "What is the most comforting sound to you?",
  "What does your soul-deep intuition whisper?",
  "What makes you feel incredibly rich?",
  "What are you sacrificing for temporary comfort?",
  "What area of your life needs more love?",
  "What is a beautiful truth you discovered?",
  "What space are you ready to occupy?",
  "What makes you feel light and free?",
  "What secret strength did you discover today?",
  "What are you most tender about right now?",
  "What represents your greatest inner wealth?",
  "What does self-acceptance look like today?",
  "What is the first step you need to take?",
  "What was the highlight of your morning?",
  "What are you holding that is not yours?",
  "What are you most stubborn about?",
  "What makes you feel fully aligned?",
  "What are you willing to fight to protect?",
  "What represents absolute clarity for you?",
  "What part of your lineage makes you proud?",
  "What does your personal sanctuary look like?",
  "What is the best advice you never followed?",
  "What simple reminder do you need right now?",
  "What represents a safe space for you?",
  "What did you do today out of pure love?",
  "What makes you feel alive and vibrant?",
  "What is the sweetest memory of this month?",
  "What is the most important question facing you?",
  "What parts of yourself are you currently uniting?",
  "What are you ready to forgive yourself for?",
  "What does internal alignment feel like to you?",
  "What are you most curious about today?",
  "What represents a clean slate to you?",
  "What brings you peace when life gets chaotic?",
  "What makes you feel beautifully human?",
  "What is the bravest thing you did today?",
  "What is a deep truth about your heart?",
  "What is your soul seeking right now?",
  "What makes you feel deeply connected to yourself?",
  "What are you allowing to occupy your mind?",
  "What represents the light at the end of the tunnel?",
  "What did you surrender to today?",
  "What brings you the most comfort when lonely?",
  "What is the most sacred part of your day?",
  "What are you holding back from giving yourself?",
  "What represents a beautiful beginning for you?",
  "What is the most direct path to your peace?",
  "What makes you feel deeply content?",
  "What is the biggest source of your strength?",
  "What are you choosing to nurture today?",
  "What represents the heartbeat of your life?",
  "What does true rest look like for you?",
  "What is a beautiful secret you carry?",
  "What makes you feel completely present?",
  "What is the most important lesson you've survived?",
  "What are you most determined to release today?"
];

function generateFormulaQuestion(rejected: string[]): string {
  const rejectedSet = new Set(rejected.map(q => q.toLowerCase().trim()));
  const available = SIMPLE_QUESTIONS.filter(q => !rejectedSet.has(q.toLowerCase().trim()));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  // Ultimate Fallback if everything is rejected
  return "What boundary do you need to set right now?";
}

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API endpoint for surprise questions (with fallback)
  app.post("/api/surprise-question", async (req, res) => {
    const rejected: string[] = req.body.rejectedQuestions || [];
    const totalInPool = SIMPLE_QUESTIONS.length;
    let remaining = Math.max(0, SIMPLE_QUESTIONS.length - rejected.length);
    
    try {
      // 1. Check if Gemini SDK is initialized/key is present
      const client = getGeminiClient();
      
      const prompt = `Generate a completely unique, highly introspective, but extremely simple and direct one-liner self-reflection question.
To keep it incredibly fresh, use your Google Search tool to look up simple, highly powerful journaling prompts, warmth-focused mindfulness inquiries, or clean life questions from the internet. Do NOT make it overly intellectual, dense, or flowery. Avoid any complex multi-clause or psychological jargon (like Jung, Stoic, CBT, ancestry, lineage, etc.). 

Strict constraints:
- Return ONLY a single, short, and extremely simple ONE-LINER question. Do NOT complicate it.
- The question must be a single, short sentence of under 12 words with zero secondary clauses.
- Keep the language completely plain, accessible, and deep but simple (e.g., "What are you hiding from yourself today?" or "Who do you need to thank right now?").
- Return ONLY the single question, starting and ending with double quotes.
- Do NOT output any intro, outro, explanations, or metadata.
- Do NOT repeat, copy, or make similar any of the following already-used or rejected questions:
${rejected.slice(-30).map(q => `- ${q}`).join("\n")}

Format: Return just the double-quoted single-sentence string. Keep it completely direct, simple, and uncomplicated.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text ? response.text.trim() : "";
      // Clean up quotes and backticks
      text = text.replace(/^[`"']+|[`"']+$/g, "").trim();

      const rejectedSet = new Set(rejected.map(q => q.toLowerCase().trim()));
      if (text && !rejectedSet.has(text.toLowerCase().trim())) {
        res.json({ question: text, source: "gemini-search", totalInPool, remaining });
        return;
      }
      
      // If Gemini returned a rejected question, run fallback
      const fallback = generateFormulaQuestion(rejected);
      res.json({ question: fallback, source: "matrix-fallback", totalInPool, remaining: Math.max(0, remaining - 1) });
    } catch (error: any) {
      // Graceful fallback to formulaic offline database generator (125,000 combinations)
      const fallback = generateFormulaQuestion(rejected);
      res.json({ question: fallback, source: "matrix", totalInPool, remaining });
    }
  });

  // Vite middleware setup for Development/Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sacred Service] Running on http://localhost:${PORT}`);
  });
}

startServer();
