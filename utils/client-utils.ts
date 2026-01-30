export const isBrowser = typeof window !== "undefined"

export function getWindow(): Window | undefined {
  return isBrowser ? window : undefined
}

export function getDocument(): Document | undefined {
  return isBrowser ? document : undefined
}
