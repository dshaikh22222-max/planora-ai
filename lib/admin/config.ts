// ─────────────────────────────────────────────────────────────
// Admin Configuration & Feature Flags
// Central config for the entire admin module.
// Toggle features without touching route files.
// ─────────────────────────────────────────────────────────────

export const ADMIN_CONFIG = {
  /** HttpOnly cookie name for admin session token */
  cookieName: "admin-session",

  /** Admin session duration — 8 hours */
  sessionDurationMs: 8 * 60 * 60 * 1000,

  /** Admin session duration in seconds (for cookie maxAge) */
  sessionDurationSec: 8 * 60 * 60,

  /** Where unauthenticated /admin requests redirect */
  loginPath: "/admin/login",

  /** Where /admin/login redirects after successful auth */
  dashboardPath: "/admin",

  /** Lock account after N failed consecutive login attempts */
  maxLoginAttempts: 5,

  /** How long a locked account remains locked (15 min) */
  lockoutDurationMs: 15 * 60 * 1000,

  /** bcrypt cost factor — 12 is OWASP-recommended minimum */
  bcryptCostFactor: 12,

  /** Signed URL expiry for secure digital asset downloads (15 min) */
  downloadLinkExpiryMs: 15 * 60 * 1000,

  /** Low-stock alert threshold for physical products */
  lowStockThreshold: 5,

  /**
   * Feature flags — set to false to hide a module from the sidebar
   * and disable its API routes. No code deletion needed.
   */
  features: {
    products: true,
    digitalAssets: true,
    physicalProducts: true,
    blog: true,
    cmsPages: true,
    siteSettings: true,
    media: true,
    users: true,
    adminUsers: true,
    orders: true,
    subscriptions: true,
    razorpayWebhook: true,
    analytics: true,
    seo: true,
    backup: true,
    security: true,
  },

  /** Navigation items shown in AdminSidebar */
  navItems: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard", section: null },
    { label: "Products", href: "/admin/products", icon: "Package", section: "Catalogue", feature: "products" },
    { label: "Digital Assets", href: "/admin/digital", icon: "Download", section: "Catalogue", feature: "digitalAssets" },
    { label: "Physical", href: "/admin/physical", icon: "Truck", section: "Catalogue", feature: "physicalProducts" },
    { label: "Media Library", href: "/admin/media", icon: "Image", section: "Catalogue", feature: "media" },
    { label: "Blog Posts", href: "/admin/blog", icon: "FileText", section: "Content", feature: "blog" },
    { label: "CMS Pages", href: "/admin/pages", icon: "Layout", section: "Content", feature: "cmsPages" },
    { label: "Site Settings", href: "/admin/settings", icon: "Settings", section: "Content", feature: "siteSettings" },
    { label: "Orders", href: "/admin/orders", icon: "ShoppingCart", section: "Commerce", feature: "orders" },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: "RefreshCw", section: "Commerce", feature: "subscriptions" },
    { label: "End Users", href: "/admin/users", icon: "Users", section: "Commerce", feature: "users" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart2", section: "Insights", feature: "analytics" },
    { label: "SEO", href: "/admin/seo", icon: "Search", section: "Insights", feature: "seo" },
    { label: "GIS Console", href: "/admin/gis", icon: "Layers", section: "Insights" },
    { label: "Admin Users", href: "/admin/admin-users", icon: "Shield", section: "System", feature: "adminUsers" },
    { label: "Backup", href: "/admin/backup", icon: "Database", section: "System", feature: "backup" },
    { label: "Security", href: "/admin/security", icon: "Lock", section: "System", feature: "security" },
  ],
} as const;

export type FeatureFlag = keyof typeof ADMIN_CONFIG.features;
