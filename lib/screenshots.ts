import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.join(process.cwd(), "public", "screenshots");
const EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

/**
 * Returns the public URL path for a real screenshot if one has been placed
 * at public/screenshots/{slug}.{png|jpg|jpeg|webp}, or null if none exists
 * yet — in which case the caller should render the placeholder mockup.
 */
export function getScreenshotUrl(slug: string): string | null {
  for (const ext of EXTENSIONS) {
    const filePath = path.join(SCREENSHOTS_DIR, `${slug}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/screenshots/${slug}.${ext}`;
    }
  }
  return null;
}
