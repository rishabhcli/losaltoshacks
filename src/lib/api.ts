import { insforge } from "./insforge";

const anonAuthorization = () => {
  const anonKey = String(import.meta.env.VITE_INSFORGE_ANON_KEY ?? "").trim();
  return anonKey ? `Bearer ${anonKey}` : "";
};

/** Add the current user session without ever forwarding the public anon key as user auth. */
export function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const authorization = insforge.getHttpClient().getHeaders().Authorization;
  if (authorization && authorization !== anonAuthorization()) {
    headers.set("Authorization", authorization);
  } else {
    headers.delete("Authorization");
  }

  return fetch(input, { ...init, headers });
}
