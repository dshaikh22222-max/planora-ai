import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A1420",
          backgroundImage:
            "linear-gradient(to right, rgba(63,134,206,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(63,134,206,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#3E86CE", fontFamily: "monospace", fontSize: 24 }}>/PL</div>
          <div style={{ color: "#EDF0EA", fontSize: 24, fontWeight: 500 }}>{site.name}</div>
        </div>
        <div
          style={{
            marginTop: 32,
            color: "#EDF0EA",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
