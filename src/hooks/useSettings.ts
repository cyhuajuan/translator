import { useState, useEffect } from "react";

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
  defaultSourceLang: "英语",
  defaultTargetLang: "法语",
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

export function useSettings() {
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

  return { settings, updateSetting, resetSettings };
}
