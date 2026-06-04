import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "B(u)y us, for us.";
  const subtitle = searchParams.get("subtitle") || "La première marketplace queer.";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#3D1F5C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient blobs */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, #E0337E33 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-50px", left: "100px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, #6D2DB533 0%, transparent 70%)",
        }} />

        {/* Prism bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "4px",
          background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)",
        }} />

        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "auto", paddingTop: "20px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "#E0337E22", border: "1px solid #E0337E44",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", color: "#E0337E",
          }}>◎</div>
          <span style={{ fontSize: "18px", color: "#F3EADB99", fontFamily: "sans-serif" }}>
            Spectrum For Us
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            fontSize: title.length > 40 ? "48px" : "64px",
            fontWeight: "300",
            color: "#F3EADB",
            lineHeight: 1.1,
            maxWidth: "900px",
            fontFamily: "serif",
          }}>
            {title}
          </div>
          <div style={{
            fontSize: "22px",
            color: "#F3EADB80",
            fontFamily: "sans-serif",
            maxWidth: "700px",
          }}>
            {subtitle}
          </div>
        </div>

        {/* URL */}
        <div style={{
          position: "absolute", bottom: "40px", right: "80px",
          fontSize: "16px", color: "#E0337E",
          fontFamily: "monospace",
        }}>
          spectrumforus.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
