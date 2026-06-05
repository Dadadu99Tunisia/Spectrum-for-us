import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, title, price, images, image_url, category, type, shops(name, slug)")
    .eq("slug", slug)
    .single();

  const name      = product?.name ?? product?.title ?? "Produit";
  const price     = product?.price ? `${Number(product.price).toFixed(2)} €` : null;
  const category  = product?.category ?? null;
  const shopName  = (product?.shops as { name?: string } | null)?.name ?? "Spectrum For Us";
  const imgUrl    = (product?.images as string[] | null)?.[0] ?? (product?.image_url as string | null);
  const type      = (product?.type as string | null) ?? "product";

  const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    service: { label: "Service",     color: "#1C9C95", bg: "rgba(28,156,149,0.15)" },
    event:   { label: "Événement",   color: "#E0901E", bg: "rgba(224,144,30,0.15)" },
    product: { label: "Création",    color: "#E0337E", bg: "rgba(255,61,127,0.15)" },
  };
  const typeInfo = TYPE_LABELS[type] ?? TYPE_LABELS.product;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #1a0d28 0%, #2d0f3f 45%, #F1ECE3 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows */}
        <div style={{
          position: "absolute", top: -60, left: -60,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,61,127,0.2) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: 300,
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,45,181,0.2) 0%, transparent 70%)",
        }} />

        {/* Prism lines */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg,#E0533A,#E0901E,#CF3F7C,#6D2DB5,#1C9C95)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg,#1C9C95,#6D2DB5,#CF3F7C,#E0901E,#E0533A)",
        }} />

        {/* Left: product image */}
        {imgUrl && (
          <div style={{
            width: 480, height: 630,
            flexShrink: 0,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* Gradient overlay right edge */}
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: 120,
              background: "linear-gradient(to right, transparent, #2d0f3f)",
            }} />
          </div>
        )}

        {/* Right: content */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: imgUrl ? "50px 70px 50px 50px" : "60px 80px",
          justifyContent: "space-between",
        }}>
          {/* Top: Spectrum brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #E0337E, #6D2DB5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ color: "#F3EADB", fontSize: 14, fontWeight: 700 }}>✦</div>
            </div>
            <span style={{
              color: "rgba(26,22,18,0.4)", fontSize: 15,
              fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase",
            }}>
              Spectrum For Us
            </span>
          </div>

          {/* Middle: product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Type badge */}
            <div style={{
              display: "flex", width: "fit-content",
              padding: "6px 16px", borderRadius: 100,
              border: `1px solid ${typeInfo.color}50`,
              background: typeInfo.bg,
              color: typeInfo.color,
              fontSize: 14, fontFamily: "monospace",
              letterSpacing: 3, textTransform: "uppercase",
            }}>
              {typeInfo.label}
            </div>

            <h1 style={{
              color: "#F3EADB",
              fontSize: imgUrl ? 48 : 60,
              fontFamily: "serif", fontWeight: 700,
              margin: 0, lineHeight: 1.1,
              letterSpacing: -0.5,
            }}>
              {name.length > 30 ? name.slice(0, 30) + "…" : name}
            </h1>

            {category && (
              <p style={{
                color: "rgba(26,22,18,0.45)",
                fontSize: 18, margin: 0,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: 3,
              }}>
                {category}
              </p>
            )}
          </div>

          {/* Bottom: price + shop */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {price && (
              <div style={{
                color: "#E0337E",
                fontSize: 52, fontFamily: "serif",
                fontWeight: 700, lineHeight: 1,
              }}>
                {price}
              </div>
            )}
            <div style={{
              color: "rgba(26,22,18,0.35)",
              fontSize: 18, fontFamily: "monospace",
              letterSpacing: 2, textTransform: "uppercase",
            }}>
              par {shopName}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
