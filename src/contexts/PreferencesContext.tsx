import { createContext } from "react";

export interface UserPreferences {
  industry: string;
  businessName: string;
  hasCompletedSetup: boolean;
}

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

export interface PreferencesContextValue {
  isAuthReady: boolean;
  preferences: UserPreferences;
  currentUser: CurrentUser | null;
  setIndustry: (industry: string) => void;
  setBusinessName: (name: string) => void;
  completeSetup: () => void;
  resetPreferences: () => void;
  login: (user: CurrentUser) => void;
  logout: () => Promise<void>;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
