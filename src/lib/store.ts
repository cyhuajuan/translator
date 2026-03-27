import { LazyStore } from '@tauri-apps/plugin-store'

const store = new LazyStore('language_prefs.json')

export default store