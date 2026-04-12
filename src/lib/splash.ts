const SESSION_KEY = "marketpulse_splash_shown";

/** Returns true if the splash has already been shown in this browser session */
export function wasSplashShown(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

/** Mark the splash as shown for this session */
export function markSplashShown(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

/** Clear the splash flag so it replays on next navigation (e.g. after login) */
export function clearSplashShown(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
