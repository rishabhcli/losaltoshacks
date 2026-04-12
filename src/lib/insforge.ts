import { createClient } from "@insforge/sdk";

function getRequiredEnvVar(name: "VITE_INSFORGE_URL" | "VITE_INSFORGE_ANON_KEY", value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export const insforge = createClient({
  baseUrl: getRequiredEnvVar("VITE_INSFORGE_URL", import.meta.env.VITE_INSFORGE_URL),
  anonKey: getRequiredEnvVar("VITE_INSFORGE_ANON_KEY", import.meta.env.VITE_INSFORGE_ANON_KEY),
});
