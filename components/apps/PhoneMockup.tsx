import Image from "next/image";

export function PhoneMockup({
  screenshotUrl,
  appName,
  accent,
}: {
  screenshotUrl: string | null;
  appName: string;
  accent: string;
}) {
  const initial = appName.charAt(0);

  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[180px] overflow-hidden rounded-[22px] border-[6px] border-ink-900 bg-ink-900 shadow-lg dark:border-ink-700">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-lg bg-ink-900 dark:bg-ink-700" />

      {screenshotUrl ? (
        <Image
          src={screenshotUrl}
          alt={`${appName} screenshot`}
          fill
          sizes="180px"
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3 px-4"
          style={{ background: `linear-gradient(160deg, ${accent}, #0A1420)` }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 font-display text-xl font-medium text-white backdrop-blur"
            aria-hidden
          >
            {initial}
          </div>
          {/* Suggested UI lines — signals "screen" without claiming to be a real capture */}
          <div className="flex w-full flex-col gap-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-white/25" />
            <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
          </div>
          <div className="mt-2 grid w-full grid-cols-3 gap-1.5">
            <div className="aspect-square rounded-md bg-white/10" />
            <div className="aspect-square rounded-md bg-white/10" />
            <div className="aspect-square rounded-md bg-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}
