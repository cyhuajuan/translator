import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export interface TranslationService {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  model: string;
}

export interface Settings {
  defaultSourceLang: string;
  defaultTargetLang: string;
  autoTranslate: boolean;
  services: TranslationService[];
  activeServiceId: string | null;
}

const defaultSettings: Settings = {
  defaultSourceLang: "中文",
  defaultTargetLang: "英文",
  autoTranslate: false,
  services: [
    {
      id: "default-openai",
      name: "OpenAI Default",
      apiUrl: "https://api.openai.com/v1/chat/completions",
      apiKey: "",
      model: "gpt-3.5-turbo",
    }
  ],
  activeServiceId: "default-openai",
};

const SETTINGS_KEY = "translator_settings";

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
