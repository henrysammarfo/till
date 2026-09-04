/**
 * Production auth storage: in-memory only in the browser.
 * Session tokens are mirrored to HttpOnly cookies via server functions.
 * Lovable preview iframes still use brokeredPreviewStorage (postMessage).
 * Never persist production sessions in localStorage.
 */
const memory = new Map<string, string>();

export function memoryAuthStorage(): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
} {
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
    removeItem: (key) => {
      memory.delete(key);
    },
  };
}

export function isLovablePreviewHost(hostname: string): boolean {
  const zones = [
    "lovableproject.com",
    "lovableproject-dev.com",
    "lovable.app",
    "gpt-eng.com",
    "gptengineer.run",
  ];
  return zones.some((z) => hostname === z || hostname.endsWith("." + z));
}
