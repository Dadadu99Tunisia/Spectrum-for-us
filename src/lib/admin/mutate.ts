// Wrapper de mutation admin : fait le fetch, remonte une erreur claire si la
// réponse n'est pas OK (au lieu d'échouer en silence). À utiliser dans un try/catch
// avec un toast/alert, ou via mutateOrAlert qui gère l'alerte pour toi.

export async function adminMutate<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error("Erreur réseau — réessaie.");
  }
  let json: { error?: string; data?: T } = {};
  try { json = await res.json(); } catch { /* réponse vide */ }
  if (!res.ok) throw new Error(json?.error || `Échec de l'opération (${res.status}).`);
  return (json?.data ?? (json as unknown)) as T;
}

/** Variante : exécute la mutation, affiche une alerte en cas d'échec, renvoie true/false. */
export async function mutateOrAlert(url: string, init?: RequestInit): Promise<boolean> {
  try {
    await adminMutate(url, init);
    return true;
  } catch (e) {
    alert(e instanceof Error ? e.message : "Échec de l'opération.");
    return false;
  }
}
