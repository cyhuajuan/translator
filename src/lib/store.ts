import { LazyStore } from '@tauri-apps/plugin-store'

const store = new LazyStore('language_prefs.json', { autoSave: false, defaults: {} })

export default store