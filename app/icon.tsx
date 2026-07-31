import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1420",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            color: "#3E86CE",
            fontSize: 30,
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          /P
        </div>
      </div>
    ),
    { ...size }
  );
}
