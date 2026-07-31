# App screenshots

Drop a real screenshot in here named after the app's slug (see `lib/apps.ts`
for the exact slug of each app), and it replaces the placeholder mockup on
`/apps` automatically — no code changes needed.

**Filename must be:** `{slug}.png` (or `.jpg`, `.jpeg`, `.webp`)

Example:
```
public/screenshots/shield-guard.png
public/screenshots/vidflow.jpg
public/screenshots/glash-interior-design.png
```

**Current slugs** (from `lib/apps.ts`):
animal-adventure, nagar-parishad, shield-guard, vidflow,
glash-interior-design, automy, private-ai, quick-brain-games,
multi-tool-utility, tap-tiles, archery-master

**Recommended size:** a real phone screenshot, portrait orientation
(roughly 1080×2340 or similar — a standard Play Store screenshot works
directly). The mockup component crops/fits it into the phone frame
automatically via `object-cover`, so exact dimensions don't need to match.

Apps without a matching file here keep showing the on-brand placeholder
(gradient + initial + suggested UI lines) — the site never breaks or shows
a broken-image icon while you're gradually adding real screenshots.
