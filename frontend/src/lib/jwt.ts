/**
 * Decode the payload of a JWT and return it as an object.
 * Falls back to null when the token is malformed or missing an "exp" claim.
 */
export function getJwtExpiry(token: string | null | undefined): number | null {
  if (!token) {
    return null;
  }

  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    if (typeof globalThis.atob !== "function") {
      throw new Error("Base64 decoder is unavailable");
    }

    const normalizedPayload = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const binary = globalThis.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const payload = JSON.parse(json);
    const exp = typeof payload.exp === "number" ? payload.exp : Number(payload.exp ?? NaN);
    if (!Number.isFinite(exp)) {
      return null;
    }
    return exp * 1000;
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return null;
  }
}

export function isJwtExpired(expiry: number | null, bufferMs = 30_000): boolean {
  if (!expiry) {
    return true;
  }
  return Date.now() + bufferMs >= expiry;
}
