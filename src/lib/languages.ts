export const LANGUAGES = [
  { code: 'zh', name: 'Chinese' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
] as const;

export type Language = (typeof LANGUAGES)[number];

export const SOURCE_LANGS = LANGUAGES;
export const TARGET_LANGS = LANGUAGES;
