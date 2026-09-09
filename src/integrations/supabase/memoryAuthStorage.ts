/**
 * Production auth storage: in-memory only in the browser.
 * Session tokens are mirrored to HttpOnly cookies via server functions.
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
