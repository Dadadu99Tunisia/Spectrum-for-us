"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Vérification d'âge pour le contenu réservé aux 18+ (produits / boutiques is_adult).
// Consentement mémorisé localement (spectrum_age_ok) pour ne pas re-demander.
const KEY = "spectrum_age_ok";
const T = { ink: "#101014", soft: "#6B6258", line: "#ECE6DB", mag: "#FF2DA0" };

function ageFrom(dob: string): number {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return -1;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
}

export function AgeGate() {
  const [ok, setOk] = useState(true);          // true tant qu'on ne sait pas → pas de flash
  const [dob, setDob] = useState("");
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try { setOk(localStorage.getItem(KEY) === "1"); } catch { setOk(false); }
  }, []);

  if (ok) return null;

  const confirm = () => {
    const a = ageFrom(dob);
    if (a < 0) return;
    if (a >= 18) { try { localStorage.setItem(KEY, "1"); } catch {} setOk(true); }
    else setDenied(true);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5" style={{ background: "rgba(16,16,20,0.92)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-sm rounded-3xl p-7 text-center" style={{ background: "#fff" }}>
        <div className="text-4xl mb-3">🔞</div>
        {denied ? (
          <>
            <h2 className="font-fraunces text-2xl mb-2" style={{ color: T.ink }}>Accès réservé aux majeur·es</h2>
            <p className="font-hanken text-sm mb-6" style={{ color: T.soft }}>Ce contenu est réservé aux personnes de 18 ans ou plus.</p>
            <Link href="/" className="inline-block px-6 py-3 rounded-full text-white font-hanken font-semibold text-sm" style={{ background: T.ink }}>Retour à l&apos;accueil</Link>
          </>
        ) : (
          <>
            <h2 className="font-fraunces text-2xl mb-1" style={{ color: T.ink }}>Contenu pour adultes</h2>
            <p className="font-hanken text-sm mb-5" style={{ color: T.soft }}>Confirme ta date de naissance pour accéder à ce contenu réservé aux 18+.</p>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-3 text-center" style={{ background: "#FBFAF8", boxShadow: `inset 0 0 0 1px ${T.line}`, color: T.ink }} />
            <button onClick={confirm} disabled={!dob}
              className="w-full py-3 rounded-full font-hanken font-semibold text-sm text-white disabled:opacity-50 mb-2" style={{ background: T.mag }}>
              J&apos;ai 18 ans ou plus — entrer
            </button>
            <Link href="/" className="block font-mono text-[11px] mt-1" style={{ color: T.soft }}>Quitter</Link>
            <p className="font-mono text-[10px] mt-4" style={{ color: T.soft }}>En continuant, tu certifies avoir l&apos;âge légal requis. Toute fausse déclaration engage ta responsabilité.</p>
          </>
        )}
      </div>
    </div>
  );
}
