const ACCOUNTS_KEY = "marketpulse-accounts";

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

export interface StoredAccount {
  email: string;
  password: string;
  displayName: string;
}

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw) as StoredAccount[];
  } catch {
    // ignore
  }
  return [];
}

export function saveStoredAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
