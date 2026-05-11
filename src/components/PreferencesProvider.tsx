import { useState, useCallback, useEffect, type ReactNode } from "react";
import { PreferencesContext, type UserPreferences, type CurrentUser } from "@/contexts/PreferencesContext";
import { getAuthErrorMessage, toCurrentUser } from "@/lib/auth";
import { insforge } from "@/lib/insforge";

function prefsKeyForEmail(email: string): string {
  return `marketpulse-prefs-${email}`;
}

const defaultPreferences: UserPreferences = {
  industry: "All",
  businessName: "",
  hasCompletedSetup: false,
};

const USER_KEY = "marketpulse-current-user";

function loadCachedUser(): CurrentUser | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CurrentUser;
      if (parsed.id && parsed.email) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveCachedUser(user: CurrentUser | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // ignore
  }
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
  const [cachedUser] = useState<CurrentUser | null>(() => loadCachedUser());
  const [isAuthReady, setIsAuthReady] = useState(cachedUser !== null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(cachedUser);
  const [preferences, setPreferences] = useState<UserPreferences>(
    loadPreferences(cachedUser?.email ?? null),
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const { data, error } = await insforge.auth.getCurrentUser();

      if (cancelled) return;

      if (error) {
        console.error(getAuthErrorMessage(error, "Failed to restore InsForge session"));
        // If we have a cached user, keep it rather than kicking to login
        if (!cachedUser) {
          setCurrentUser(null);
          setPreferences(defaultPreferences);
        }
        setIsAuthReady(true);
        return;
      }

      if (data?.user?.email) {
        const user = toCurrentUser(data.user);
        setCurrentUser(user);
        saveCachedUser(user);
        setPreferences(loadPreferences(user.email));
      } else if (!cachedUser) {
        setCurrentUser(null);
        saveCachedUser(null);
        setPreferences(defaultPreferences);
      }

      setIsAuthReady(true);
    }

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [cachedUser]);

  useEffect(() => {
    if (!isAuthReady) return;
    savePreferences(currentUser?.email ?? null, preferences);
  }, [isAuthReady, preferences, currentUser]);

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

  const login = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    saveCachedUser(user);
    setPreferences(loadPreferences(user.email));
  }, []);

  const logout = useCallback(async () => {
    const { error } = await insforge.auth.signOut();
    if (error) {
      console.error(getAuthErrorMessage(error, "Failed to sign out"));
    }
    setCurrentUser(null);
    saveCachedUser(null);
    setPreferences(defaultPreferences);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        isAuthReady,
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
