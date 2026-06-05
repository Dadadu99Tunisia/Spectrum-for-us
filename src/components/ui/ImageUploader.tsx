"use client";
import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

type Bucket = "shop-assets" | "shop-images" | "product-images" | "kyc-documents";

interface ImageUploaderProps {
  bucket: Bucket;
  folder?: string;           // shop_id pour shop-assets
  value?: string;            // URL actuelle
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspect?: "square" | "banner" | "free";
  className?: string;
}

export function ImageUploader({
  bucket,
  folder,
  value,
  onChange,
  label = "Image",
  hint,
  aspect = "square",
  className = "",
}: ImageUploaderProps) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [preview, setPreview]   = useState<string | null>(value ?? null);
  const [dragOver, setDragOver] = useState(false);

  const aspectClass = {
    square: "aspect-square",
    banner: "aspect-[3/1]",
    free:   "min-h-[120px]",
  }[aspect];

  const upload = async (file: File) => {
    setError(null);
    setLoading(true);

    // Aperçu local immédiat
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      if (folder) fd.append("folder", folder);

      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json() as { url?: string; error?: string };

      if (!res.ok || json.error) {
        setError(json.error ?? "Erreur upload");
        setPreview(value ?? null);
      } else {
        onChange(json.url!);
      }
    } catch {
      setError("Erreur réseau");
      setPreview(value ?? null);
    }
    setLoading(false);
  };

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30">
          {label}
        </label>
      )}

      <div
        className={`relative ${aspectClass} w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${dragOver ? "border-[#FF3D7F] bg-[#FF3D7F]/5" : "border-[#1A1612]/15 hover:border-[#1A1612]/30"}
          ${loading ? "pointer-events-none" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Image preview */}
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100 gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              >
                <Upload size={16} />
              </button>
              <button onClick={clear}
                className="p-2 rounded-xl bg-red-500/30 backdrop-blur-sm text-white hover:bg-red-500/50 transition-colors">
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
            {loading ? (
              <Loader2 size={24} className="text-[#FF3D7F] animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#1A1612]/5 flex items-center justify-center">
                  <ImageIcon size={20} className="text-[#1A1612]/20" />
                </div>
                <div>
                  <p className="font-hanken text-sm text-[#1A1612]/40">
                    <span className="text-[#FF3D7F]">Choisir</span> ou glisser-déposer
                  </p>
                  {hint && <p className="font-mono text-[9px] text-[#1A1612]/20 mt-1">{hint}</p>}
                </div>
              </>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-[#FF3D7F] animate-spin" />
              <p className="font-mono text-[10px] text-white/60">Upload en cours…</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="font-mono text-[10px] text-red-400 flex items-center gap-1">
          <X size={10} /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ── Version multi-images ──────────────────────────────────────────
interface MultiImageUploaderProps {
  bucket: Bucket;
  folder?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
}

export function MultiImageUploader({
  bucket,
  folder,
  values,
  onChange,
  max = 5,
  label = "Photos",
}: MultiImageUploaderProps) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);
    if (folder) fd.append("folder", folder);

    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json() as { url?: string; error?: string };
    if (!res.ok || json.error) { setError(json.error ?? "Erreur"); return null; }
    return json.url!;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - values.length;
    if (remaining <= 0) { setError(`Maximum ${max} images`); return; }

    setLoading(true);
    setError(null);
    const toUpload = Array.from(files).slice(0, remaining);
    const urls = await Promise.all(toUpload.map(uploadFile));
    const valid = urls.filter(Boolean) as string[];
    onChange([...values, ...valid]);
    setLoading(false);
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-mono text-[9px] uppercase tracking-widest text-[#1A1612]/30">
          {label} <span className="text-[#1A1612]/20 normal-case">({values.length}/{max})</span>
        </label>
      )}

      <div className="grid grid-cols-3 gap-2">
        {values.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-[#1A1612]/10 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => remove(i)}
              className="absolute top-1 right-1 p-1 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/70">
              <X size={11} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 font-mono text-[8px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                Principale
              </span>
            )}
          </div>
        ))}

        {values.length < max && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="aspect-square rounded-xl border-2 border-dashed border-[#1A1612]/15 hover:border-[#FF3D7F]/40 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-40"
          >
            {loading
              ? <Loader2 size={18} className="text-[#FF3D7F] animate-spin" />
              : <><Upload size={18} className="text-[#1A1612]/25" /><span className="font-mono text-[9px] text-[#1A1612]/25">Ajouter</span></>
            }
          </button>
        )}
      </div>

      {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
