import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch shop data
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from("shops")
    .select("name, tagline, logo_url, city")
    .eq("slug", slug)
    .single();

  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", (await supabase.from("shops").select("id").eq("slug", slug).single()).data?.id ?? "");

  const name     = shop?.name     ?? slug;
  const tagline  = shop?.tagline  ?? "Boutique sur Spectrum For Us";
  const city     = shop?.city     ?? null;
  const logoUrl  = shop?.logo_url ?? null;
  const initiale = String(name)[0]?.toUpperCase() ?? "S";
  const count    = productCount ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1a0d28 0%, #2d0f3f 45%, #0e1e1f 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: -80, left: -80,
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,61,127,0.25) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -60,
          width: 450, height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,45,181,0.2) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: 200, right: 200,
          width: 300, height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,156,149,0.15) 0%, transparent 70%)",
        }} />

        {/* Prism line top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)",
        }} />

        {/* Prism line bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg,#1C9C95,#6D2DB5,#CF3F7C,#E0901E,#E0533A)",
        }} />

        {/* Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "60px 80px",
          justifyContent: "space-between",
        }}>
          {/* Top: Spectrum brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #E0337E, #6D2DB5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ color: "#F3EADB", fontSize: 18, fontWeight: 700 }}>✦</div>
            </div>
            <span style={{
              color: "rgba(26,22,18,0.5)",
              fontSize: 18,
              fontFamily: "serif",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}>
              Spectrum For Us
            </span>
          </div>

          {/* Middle: Shop info */}
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {/* Logo */}
            <div style={{
              width: 120, height: 120,
              borderRadius: 24,
              border: "3px solid rgba(255,61,127,0.4)",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(255,61,127,0.2), rgba(109,45,181,0.2))",
              flexShrink: 0,
            }}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "#E0337E", fontSize: 52, fontFamily: "serif", fontWeight: 700 }}>
                  {initiale}
                </span>
              )}
            </div>

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h1 style={{
                color: "#F3EADB",
                fontSize: 64,
                fontFamily: "serif",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: -1,
              }}>
                {name.length > 22 ? name.slice(0, 22) + "…" : name}
              </h1>
              {tagline && (
                <p style={{
                  color: "rgba(26,22,18,0.6)",
                  fontSize: 26,
                  margin: 0,
                  fontFamily: "sans-serif",
                  lineHeight: 1.3,
                  maxWidth: 700,
                }}>
                  {tagline.length > 60 ? tagline.slice(0, 60) + "…" : tagline}
                </p>
              )}
            </div>
          </div>

          {/* Bottom: meta chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 20px",
              borderRadius: 100,
              border: "1px solid rgba(255,61,127,0.3)",
              background: "rgba(255,61,127,0.1)",
              color: "#E0337E",
              fontSize: 18,
              fontFamily: "monospace",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}>
              ✦ Boutique queer
            </div>
            {count > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                border: "1px solid rgba(26,22,18,0.15)",
                color: "rgba(26,22,18,0.5)",
                fontSize: 18,
                fontFamily: "monospace",
              }}>
                {count} création{count > 1 ? "s" : ""}
              </div>
            )}
            {city && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                border: "1px solid rgba(26,22,18,0.1)",
                color: "rgba(26,22,18,0.4)",
                fontSize: 18,
                fontFamily: "monospace",
              }}>
                📍 {city}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
