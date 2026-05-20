import { JournalPage } from "./types";

export interface Product {
  id: string;
  name: string;
  category: "Digital Journals" | "Energy Remedies" | "Ritual Guides";
  price: number;
  description: string;
  cosmicBenefit: string;
  image: string;
  fileFormat: string;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "journal-free",
    name: "Cleanse Your Souls (Free)",
    category: "Digital Journals",
    price: 0,
    description: "A sacred mirror for your inner world. A foundational guide to deep self-reflection, designed to help you listen to the whispers of your own soul.",
    cosmicBenefit: "Removes negativity and aligns internal energy.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    fileFormat: "3-Page PDF",
    featured: false,
  },
  {
    id: "journal-20",
    name: "Cleanse Your Souls",
    category: "Digital Journals",
    price: 19,
    description: "20 deep-dive questions for spiritual discipline. Each copy is digitally personalized with your Sacred Name.",
    cosmicBenefit: "Clears emotional blockages and harmonizes the heart.",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    fileFormat: "24-Page Personalized PDF",
    featured: true,
  },
  {
    id: "digital-2",
    name: "Mother Grace: Emergency Audio-Pills",
    category: "Energy Remedies",
    price: 22,
    description: "A curative collection of 5-minute 'vibrational transmissions' to be used during moments of acute anxiety or disconnection.",
    cosmicBenefit: "Instant nervous system regulation and transmutes negative energy.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
    fileFormat: "High-Res MP3 Bundle",
    featured: false,
  },
  {
    id: "digital-4",
    name: "Digital 'Charging' Sanctuary",
    category: "Energy Remedies",
    price: 15,
    description: "A loopable 4K visual of a flickering sacred lamp and glowing crystal for your desktop or tablet, designed to hold space for your intentions.",
    cosmicBenefit: "Maintains a high-frequency environment in your digital space.",
    image: "https://images.unsplash.com/photo-1603512914166-417ba36e1b72?auto=format&fit=crop&q=80&w=800",
    fileFormat: "4K MP4 / Live Wallpaper",
  }
];

export const CATEGORIES = ["Digital Journals", "Energy Remedies", "Ritual Guides"] as const;
export type Category = (typeof CATEGORIES)[number];

export const DEFAULT_ARTIFACT_PAGES: Record<string, JournalPage[]> = {
  "journal-free": [
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
  ],
  "journal-20": [
    {
      id: 1,
      title: "The Hearth of the Self",
      subtitle: "Opening the inner warmth",
      content: "The home you seek is the breath that you take inside this temple.",
      prompt: "Who is the owner of your inner peace?",
      aesthetic: "Ruby"
    },
    {
      id: 2,
      title: "The River of Sorrow",
      subtitle: "Releasing stagnant blockages",
      content: "Letting the high tides clean out the ancient silt of your struggles.",
      prompt: "What shame are you ready to wash away from your heart?",
      aesthetic: "Amethyst"
    },
    {
      id: 3,
      title: "The Mirror of Forgiveness",
      subtitle: "Healing the past",
      content: "You are the judge, the jury, and the prisoner. Open the gate and walk out.",
      prompt: "Who must you excuse today to set yourself free?",
      aesthetic: "Emerald"
    }
  ],
  "journal-50": [
    {
      id: 1,
      title: "Greeting the Silent Guardian",
      subtitle: "A dialog with your highest self",
      content: "The silent guardian stands at the gates, waiting for the correct passcode: truth.",
      prompt: "What password have you forgotten?",
      aesthetic: "Amber"
    },
    {
      id: 2,
      title: "Transmuting the Shadow",
      subtitle: "Alchemical shadow work",
      content: "Every dark shadow is just fuel waiting for the divine flare of awareness.",
      prompt: "How can you burn your fears to generate more inner light?",
      aesthetic: "Sapphire"
    },
    {
      id: 3,
      title: "Cosmic Ancestral Resonance",
      subtitle: "Calling the ancient guides",
      content: "A thousand generations had to survive so you could think this very thought. Stand tall.",
      prompt: "What ancestral song is humming in your bone structure?",
      aesthetic: "Indigo"
    }
  ],
  "journal-bundle": [
    {
      id: 1,
      title: "Unified Consciousness",
      subtitle: "The totality of the self",
      content: "You are not just a fragment of life; you are the entire space containing it.",
      prompt: "Name three cosmic waves you are aware of flowing through you right now.",
      aesthetic: "Aged Gold"
    },
    {
      id: 2,
      title: "Unconditional Freedom",
      subtitle: "Lifting the veil of identity",
      content: "True freedom is having nothing to protect, nothing to prove, and nothing to hide.",
      prompt: "What is the primary thing you are hiding from your own mirror?",
      aesthetic: "Rose Quartz"
    }
  ]
};
