export type AppEntry = {
  slug: string;
  name: string;
  tagline: string;
  stack: string;
  status: "Published" | "In Development";
  /** Accent used for the placeholder mockup until a real screenshot exists. */
  accent: string;
};

export const apps: AppEntry[] = [
  {
    slug: "animal-adventure",
    name: "Animal Adventure",
    tagline: "A reimagined take on Snakes & Ladders, rebuilt as a full game rather than a board-and-dice clone.",
    stack: "Unity / C#",
    status: "In Development",
    accent: "#3E86CE",
  },
  {
    slug: "nagar-parishad",
    name: "Nagar Parishad",
    tagline: "A municipal council simulation — citizen request queues, departmental budgets, elections, and ward-level satisfaction.",
    stack: "Flutter",
    status: "In Development",
    accent: "#1F5FA8",
  },
  {
    slug: "shield-guard",
    name: "Shield Guard",
    tagline: "Full-stack Android content blocking with a local VPN DNS filter, on-device NSFW classification, and accountability-partner features.",
    stack: "Flutter, Kotlin, Node.js/Express",
    status: "Published",
    accent: "#B23A2E",
  },
  {
    slug: "vidflow",
    name: "VidFlow",
    tagline: "A short-form video app that evolved into an AI influencer platform — user-generated AI characters with auto-generated content.",
    stack: "Flutter, FastAPI/SQLAlchemy",
    status: "Published",
    accent: "#8F2E24",
  },
  {
    slug: "glash-interior-design",
    name: "Glash Interior Design",
    tagline: "AI-powered interior design across 40+ cultural themes, with offline image editing and multi-provider AI generation.",
    stack: "Flutter",
    status: "Published",
    accent: "#194C89",
  },
  {
    slug: "automy",
    name: "Automy",
    tagline: "On-device AI inference bundling small open models — no cloud round-trip required.",
    stack: "Flutter, Kotlin/JNI, llama.cpp",
    status: "Published",
    accent: "#143C6D",
  },
  {
    slug: "private-ai",
    name: "Private AI",
    tagline: "A fully offline AI assistant with on-device GGUF inference, token streaming, and OCR/PDF input.",
    stack: "Flutter, llama.cpp",
    status: "Published",
    accent: "#0F2D52",
  },
  {
    slug: "quick-brain-games",
    name: "Quick Brain Games",
    tagline: "A brain-training game collection built for the Indian mobile market.",
    stack: "Flutter",
    status: "Published",
    accent: "#6BA6DF",
  },
  {
    slug: "multi-tool-utility",
    name: "Multi-Tool Utility",
    tagline: "A general-purpose Android utility app consolidating everyday tools into one download.",
    stack: "Flutter",
    status: "Published",
    accent: "#526A76",
  },
  {
    slug: "tap-tiles",
    name: "Tap Tiles",
    tagline: "A fast-paced viral tile-tapping game built for the Indian mobile market.",
    stack: "Flutter",
    status: "Published",
    accent: "#9FC5EB",
  },
  {
    slug: "archery-master",
    name: "Archery Master",
    tagline: "A 3D archery game with a full monetization stack — ads, in-app purchases, and a battle pass.",
    stack: "Unity / C#",
    status: "Published",
    accent: "#33495A",
  },
];
