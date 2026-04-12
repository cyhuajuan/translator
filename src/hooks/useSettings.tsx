import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";

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
  services: TranslationService[];
  activeServiceId: string | null;
  systemPrompt: string;
}

export const DEFAULT_SYSTEM_PROMPT =
  "你是一位专业的翻译专家。请将以下{{sourceLang}}文本翻译为{{targetLang}}，只输出翻译结果，不要添加任何解释或额外内容。";

const defaultSettings: Settings = {
  defaultSourceLang: "中文",
  defaultTargetLang: "英文",
  services: [
    {
      id: "default-openai",
      name: "OpenAI Default",
      apiUrl: "https://api.openai.com/v1",
      apiKey: "",
      model: "gpt-3.5-turbo",
    }
  ],
  activeServiceId: "default-openai",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
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
