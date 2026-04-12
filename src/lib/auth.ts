import type { CurrentUser } from "@/contexts/PreferencesContext";

const KNOWN_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "mail.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "zohomail.com",
  "fastmail.com",
  "tutanota.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "hey.com",
  "pm.me",
  "mailbox.org",
]);

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();

  // Basic format check
  if (!trimmed || !trimmed.includes("@")) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  const [localPart, ...domainParts] = trimmed.split("@");
  const domain = domainParts.join("@");

  if (!localPart || !domain) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  // Domain must contain at least one dot
  if (!domain.includes(".")) {
    return { valid: false, error: "This email domain is not recognized" };
  }

  // Split domain into parts
  const parts = domain.split(".");
  const tld = parts[parts.length - 1];

  // TLD must be 2-6 characters
  if (tld.length < 2 || tld.length > 6) {
    return { valid: false, error: "This email domain is not recognized" };
  }

  // All domain parts must be non-empty and alphanumeric (with hyphens)
  for (const part of parts) {
    if (!part || !/^[a-z0-9-]+$/.test(part)) {
      return { valid: false, error: "This email domain is not recognized" };
    }
  }

  // Accept known consumer email providers
  if (KNOWN_EMAIL_DOMAINS.has(domain)) {
    return { valid: true };
  }

  // Accept .edu and .gov domains
  if (tld === "edu" || tld === "gov") {
    return { valid: true };
  }

  // Accept any corporate-like domain (something.tld with valid TLD length)
  if (parts.length >= 2) {
    return { valid: true };
  }

  return { valid: false, error: "This email domain is not recognized" };
}

interface AuthUserLike {
  id?: string;
  email?: string | null;
  emailVerified?: boolean;
  profile?: {
    name?: string | null;
  } | null;
}

export function toCurrentUser(user: AuthUserLike, fallbackDisplayName?: string): CurrentUser {
  const email = user.email?.trim().toLowerCase() ?? "";
  const displayName = user.profile?.name?.trim() || fallbackDisplayName?.trim() || email.split("@")[0] || "User";

  return {
    id: user.id ?? email,
    email,
    displayName,
    emailVerified: Boolean(user.emailVerified),
  };
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const typedError = error as {
    message?: string;
    nextActions?: string;
  };

  const details = [typedError.message, typedError.nextActions].filter(
    (value): value is string => Boolean(value && value.trim()),
  );

  return details[0] ? details.join(". ") : fallback;
}
