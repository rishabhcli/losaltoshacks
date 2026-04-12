import { useState, useCallback, useEffect, type ReactNode } from "react";
import { PreferencesContext, type UserPreferences, type CurrentUser } from "@/contexts/PreferencesContext";
import { getStoredAccounts } from "@/lib/auth";

const CURRENT_USER_KEY = "marketpulse-current-user";

function prefsKeyForEmail(email: string): string {
  return `marketpulse-prefs-${email}`;
}

const defaultPreferences: UserPreferences = {
  industry: "All",
  businessName: "",
  hasCompletedSetup: false,
};

function getCurrentUserEmail(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function resolveCurrentUser(email: string): CurrentUser | null {
  const accounts = getStoredAccounts();
  const account = accounts.find(a => a.email === email);
  if (!account) return null;
  return { email: account.email, displayName: account.displayName };
}

function loadPreferences(email: string | null): UserPreferences {
  if (!email) return defaultPreferences;
  try {
    const stored = localStorage.getItem(prefsKeyForEmail(email));
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserPreferences>;
      return { ...defaultPreferences, ...parsed };
    }
  } catch {
    // Ignore parse errors, use defaults
  }
  return defaultPreferences;
}

function savePreferences(email: string | null, prefs: UserPreferences) {
  if (!email) return;
  try {
    localStorage.setItem(prefsKeyForEmail(email), JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const email = getCurrentUserEmail();
    return email ? resolveCurrentUser(email) : null;
  });
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences(currentUser?.email ?? null));

  // Persist to localStorage on change
  useEffect(() => {
    savePreferences(currentUser?.email ?? null, preferences);
  }, [preferences, currentUser]);

  const setIndustry = useCallback((industry: string) => {
    setPreferences(prev => ({ ...prev, industry }));
  }, []);

  const setBusinessName = useCallback((businessName: string) => {
    setPreferences(prev => ({ ...prev, businessName }));
  }, []);

  const completeSetup = useCallback(() => {
    setPreferences(prev => ({ ...prev, hasCompletedSetup: true }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({ ...defaultPreferences, hasCompletedSetup: true });
  }, []);

  const login = useCallback((email: string) => {
    localStorage.setItem(CURRENT_USER_KEY, email);
    const user = resolveCurrentUser(email);
    setCurrentUser(user);
    setPreferences(loadPreferences(email));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setPreferences(defaultPreferences);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        currentUser,
        setIndustry,
        setBusinessName,
        completeSetup,
        resetPreferences,
        login,
        logout,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
