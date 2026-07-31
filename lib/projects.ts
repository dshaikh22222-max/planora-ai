export type ProjectEntry = {
  name: string;
  description: string;
  stack: string;
};

export const projects: ProjectEntry[] = [
  {
    name: "DevForge",
    description: "A visual Flutter app-scaffolding platform — design a screen flow visually, generate a real Flutter project from it.",
    stack: "FastAPI backend, React web frontend, Flutter Android client",
  },
  {
    name: "MH Town Planner",
    description: "A Maharashtra-focused legal app including a town-planning case-law library covering real Indian court cases.",
    stack: "Flutter",
  },
  {
    name: "CreatorStats",
    description: "A companion SaaS analytics dashboard for VidFlow, built to track creator performance and early revenue.",
    stack: "Next.js",
  },
  {
    name: "Language Workbench",
    description: "A visual tool for building custom programming languages — a block-based grammar builder paired with a tree-walk interpreter.",
    stack: "React, Electron",
  },
];
