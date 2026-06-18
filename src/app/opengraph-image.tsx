import { ImageResponse } from "next/og";

export const alt = "What God Says About Me";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Single static brand card used for every share (matches the app palette).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6f8fb",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#607691",
            fontWeight: 800,
          }}
        >
          What God Says About Me
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 72,
            lineHeight: 1.15,
            color: "#1b2737",
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          A reminder of who God says you are.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 30,
            fontStyle: "italic",
            color: "#9aa6b6",
          }}
        >
          whatgodsaysabout.me
        </div>
      </div>
    ),
    { ...size }
  );
}
