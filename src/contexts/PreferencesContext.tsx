import { createContext } from "react";

export interface UserPreferences {
  industry: string;
  businessName: string;
  hasCompletedSetup: boolean;
}

export interface CurrentUser {
  email: string;
  displayName: string;
}

export interface PreferencesContextValue {
  preferences: UserPreferences;
  currentUser: CurrentUser | null;
  setIndustry: (industry: string) => void;
  setBusinessName: (name: string) => void;
  completeSetup: () => void;
  resetPreferences: () => void;
  login: (email: string) => void;
  logout: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
