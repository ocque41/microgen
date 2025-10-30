const RAW_BASE_URL = import.meta.env.BASE_URL ?? "/";
const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL : `${RAW_BASE_URL}/`;

/**
 * Resolves a file stored under the Vite public directory so it works with
 * both the dev server (`/`) and production builds with a custom base path.
 */
export function publicAsset(path: string) {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}${normalizedPath}`;
}
