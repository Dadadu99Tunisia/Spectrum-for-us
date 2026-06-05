import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Spectrum For Us — La marketplace queer";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0d28 0%, #2d0f3f 45%, #0e1e1f 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Large glow blobs */}
        <div style={{
          position: "absolute", top: -120, left: -80,
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,61,127,0.2) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -60,
          width: 550, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,45,181,0.2) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", top: 100, right: 100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,156,149,0.12) 0%, transparent 65%)",
        }} />

        {/* Prism top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 5,
          background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)",
        }} />
        {/* Prism bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 5,
          background: "linear-gradient(90deg,#1C9C95,#6D2DB5,#CF3F7C,#E0901E,#E0533A)",
        }} />

        {/* Content */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 24,
        }}>
          {/* Logo mark */}
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: "linear-gradient(135deg, #E0337E, #6D2DB5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 60px rgba(255,61,127,0.4)",
          }}>
            <span style={{ color: "#F3EADB", fontSize: 40, fontWeight: 700 }}>✦</span>
          </div>

          {/* Title */}
          <h1 style={{
            color: "#F3EADB",
            fontSize: 80,
            fontFamily: "serif",
            fontWeight: 700,
            margin: 0,
            lineHeight: 1,
            letterSpacing: -2,
            textAlign: "center",
          }}>
            Spectrum For Us
          </h1>

          {/* Tagline */}
          <p style={{
            color: "rgba(26,22,18,0.55)",
            fontSize: 28,
            fontFamily: "sans-serif",
            margin: 0,
            textAlign: "center",
            letterSpacing: 1,
          }}>
            La première marketplace queer
          </p>

          {/* Pills */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {["Mode", "Art", "Bien-être", "Services", "Événements"].map((label, i) => {
              const colors = ["#E0337E", "#E0901E", "#1C9C95", "#6D2DB5", "#CF3F7C"];
              return (
                <div key={label} style={{
                  padding: "8px 20px", borderRadius: 100,
                  border: `1px solid ${colors[i]}50`,
                  background: `${colors[i]}15`,
                  color: colors[i],
                  fontSize: 16,
                  fontFamily: "monospace",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}>
                  {label}
                </div>
              );
            })}
          </div>

          {/* URL */}
          <p style={{
            color: "rgba(26,22,18,0.25)",
            fontSize: 18,
            fontFamily: "monospace",
            margin: 0,
            letterSpacing: 3,
            marginTop: 8,
          }}>
            spectrumforus.com
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
