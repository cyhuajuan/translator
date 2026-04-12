import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { load, type Store } from "@tauri-apps/plugin-store";

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
    },
  ],
  activeServiceId: "default-openai",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
};

/** Store 文件名，保存在系统 AppData 目录下 */
const STORE_FILE = "settings.json";
const SETTINGS_KEY = "translator_settings";

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [store, setStore] = useState<Store | null>(null);

  // 初始化：加载 store 并读取已保存的设置
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const s = await load(STORE_FILE);
        if (cancelled) return;
        setStore(s);

        const stored = await s.get<Settings>(SETTINGS_KEY);
        if (cancelled) return;
        if (stored) {
          setSettings((prev) => ({ ...prev, ...stored }));
        }
      } catch (e) {
        console.error("Failed to load settings from file", e);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // 每次 settings 变化时写入文件（store 就绪后）
  useEffect(() => {
    if (!store) return;

    async function persist() {
      try {
        await store!.set(SETTINGS_KEY, settings);
        await store!.save();
      } catch (e) {
        console.error("Failed to save settings to file", e);
      }
    }

    persist();
  }, [settings, store]);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

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
