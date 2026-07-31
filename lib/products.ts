export type Product = {
  code: string; // drafting-style reference code, e.g. "TP-01"
  slug: string;
  name: string;
  summary: string;
  status: "Live" | "Beta" | "In Development";
  description: string;
  features: string[];
  faqs: { question: string; answer: string }[];
};

// Single source of truth. Home, /products, and individual product pages all
// read from this list — add a product here and it appears everywhere.
export const products: Product[] = [
  {
    code: "TP-01",
    slug: "town-planning-ai",
    name: "Town Planning AI",
    summary:
      "A ChatGPT-style assistant trained on India's town planning, RERA, and building-code corpus, answering with section-level citations.",
    status: "Live",
    description:
      "Ask a question about town planning anywhere in India and get an answer traceable to the exact act, rule, or clause it came from. Town Planning AI combines a bundled knowledge base of planning law with retrieval-augmented search, so every response cites its source instead of guessing.",
    features: [
      "Section-level citations on every answer",
      "Covers RERA, MRTP, UDCPR, and state-specific building codes",
      "Retrieval-augmented search over a bundled legal knowledge base",
      "LLM fallback when a query falls outside the indexed corpus",
      "Conversational, ChatGPT-style interface",
    ],
    faqs: [
      {
        question: "Which states does Town Planning AI cover?",
        answer:
          "The knowledge base spans regulations across India, with the deepest coverage in Maharashtra. Coverage for other states is expanding alongside Rule Search AI.",
      },
      {
        question: "How are citations generated?",
        answer:
          "Answers are retrieved from an indexed corpus of planning documents, and each response links back to the specific section or clause it draws from.",
      },
    ],
  },
  {
    code: "LS-02",
    slug: "layout-scrutiny-ai",
    name: "Layout Scrutiny AI",
    summary: "Automated scrutiny of layout plans against development-control regulations before submission.",
    status: "Beta",
    description:
      "Upload a layout plan and Layout Scrutiny AI checks it against the applicable development-control regulations — setbacks, FSI, road widths, open-space requirements — before it reaches a scrutiny officer's desk.",
    features: [
      "Automated setback and FSI compliance checks",
      "Flags violations before formal submission",
      "Works against state and municipal development-control rules",
      "Generates a shareable scrutiny report",
    ],
    faqs: [
      {
        question: "What file formats are supported?",
        answer: "Layout Scrutiny AI currently accepts common CAD export and PDF formats for plan review.",
      },
    ],
  },
  {
    code: "BP-03",
    slug: "building-permission-ai",
    name: "Building Permission AI",
    summary: "Guides applicants through building-permission workflows and flags compliance gaps early.",
    status: "Beta",
    description:
      "Building Permission AI walks applicants through the documentation and compliance steps required for a building-permission application, flagging gaps before they turn into rejection letters.",
    features: [
      "Step-by-step permission workflow guidance",
      "Early compliance gap detection",
      "Document checklist tailored to project type",
      "Status tracking through the approval process",
    ],
    faqs: [
      {
        question: "Does this file the application on my behalf?",
        answer:
          "No — Building Permission AI prepares and checks your application so it's ready for submission through the relevant municipal authority.",
      },
    ],
  },
  {
    code: "GIS-04",
    slug: "gis-ai",
    name: "GIS AI",
    summary: "Maps parcels, zoning, and land-use data with AI-assisted spatial analysis.",
    status: "In Development",
    description:
      "GIS AI overlays parcel boundaries, zoning classifications, and land-use data on an interactive map, with AI-assisted analysis to answer spatial questions about a site.",
    features: [
      "Parcel and zoning overlay mapping",
      "AI-assisted spatial queries",
      "Land-use classification lookup",
    ],
    faqs: [
      {
        question: "When does GIS AI launch?",
        answer: "GIS AI is in active development. Join the newsletter for launch updates.",
      },
    ],
  },
  {
    code: "DP-05",
    slug: "development-plan-ai",
    name: "Development Plan AI",
    summary: "Reads and cross-references municipal development plans against proposed projects.",
    status: "In Development",
    description:
      "Development Plan AI reads a municipality's development plan and cross-references it against a proposed project, surfacing conflicts and zoning constraints automatically.",
    features: [
      "Automated development-plan cross-referencing",
      "Zoning conflict detection",
      "Municipality-specific plan ingestion",
    ],
    faqs: [
      {
        question: "When does Development Plan AI launch?",
        answer: "It's in active development. Join the newsletter for launch updates.",
      },
    ],
  },
  {
    code: "MRTP-06",
    slug: "mrtp-ai",
    name: "MRTP AI",
    summary: "Purpose-built assistant for the Maharashtra Regional and Town Planning Act.",
    status: "Live",
    description:
      "MRTP AI is a focused assistant trained specifically on the Maharashtra Regional and Town Planning Act, built for planners and consultants working within Maharashtra's regulatory framework.",
    features: [
      "Full-text coverage of the MRTP Act",
      "Section-level citations",
      "Maharashtra-specific case references",
    ],
    faqs: [
      {
        question: "How does MRTP AI differ from Town Planning AI?",
        answer:
          "MRTP AI is scoped narrowly to the Maharashtra Regional and Town Planning Act, while Town Planning AI spans planning law across India.",
      },
    ],
  },
  {
    code: "UDCPR-07",
    slug: "udcpr-ai",
    name: "UDCPR AI",
    summary: "Section-accurate answers on Unified Development Control and Promotion Regulations.",
    status: "Live",
    description:
      "UDCPR AI answers questions on Maharashtra's Unified Development Control and Promotion Regulations with section-accurate citations, covering FSI, premiums, and building typologies.",
    features: [
      "Full UDCPR text coverage",
      "FSI and premium calculation references",
      "Building-typology specific regulation lookup",
    ],
    faqs: [
      {
        question: "Is UDCPR AI kept up to date with amendments?",
        answer: "The underlying knowledge base is updated as amendments are published.",
      },
    ],
  },
  {
    code: "DOC-08",
    slug: "document-ai",
    name: "Document AI",
    summary: "Extracts and structures data from permission letters, sanction plans, and survey documents.",
    status: "In Development",
    description:
      "Document AI extracts structured data — survey numbers, sanctioned FSI, approval dates — from permission letters, sanction plans, and survey documents, turning scanned paperwork into searchable records.",
    features: [
      "Structured extraction from scanned documents",
      "Survey number and approval metadata parsing",
      "Bulk document processing",
    ],
    faqs: [
      {
        question: "When does Document AI launch?",
        answer: "It's in active development. Join the newsletter for launch updates.",
      },
    ],
  },
  {
    code: "RS-09",
    slug: "rule-search-ai",
    name: "Rule Search AI",
    summary: "Cross-state regulation search engine spanning every Indian state's planning rules.",
    status: "In Development",
    description:
      "Rule Search AI is a search engine purpose-built for planning regulations across every Indian state, letting you compare how a rule — like FSI or setback requirements — varies state to state.",
    features: [
      "Cross-state regulation search",
      "Side-by-side rule comparison",
      "Expanding state coverage",
    ],
    faqs: [
      {
        question: "How many states are currently indexed?",
        answer: "Coverage is expanding progressively across all 28 states. Maharashtra has the deepest coverage today.",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
