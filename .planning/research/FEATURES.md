# Feature Landscape

**Domain:** Desktop Translation Application
**Researched:** 2026-03-27
**Confidence:** MEDIUM (based on training data; web search unavailable for verification)

## Table Stakes

Features users expect in any translator app. Missing these = product feels broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Text input area** | Users need somewhere to enter text | Low | Must support paste, type, drag-drop |
| **Language selection** | Core translation flow | Low | Source + target language dropdowns |
| **Translate button / auto-translate** | Triggers the action | Low | Auto-detect is preferred convenience |
| **Translation output display** | Shows result | Low | Read-only, copyable text area |
| **Copy to clipboard** | Essential workflow step | Low | One-click copy of translation |
| **Clear / reset** | Start fresh without reload | Low | Clear both input and output |
| **Offline indicator** | Users need to know connection status | Low | For local AI: shows if Ollama is running |

## Differentiators

Features that set a product apart. Not expected, but valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Live translation / auto-translate on typing** | Faster workflow, feels "smart" | Medium | Requires debouncing, good performance |
| **Translation history** | Reference previous translations | Medium | Local storage, searchable |
| **Favorites / saved translations** | Quick access to important phrases | Low | Star or bookmark translations |
| **Multiple simultaneous translations** | Compare translations side-by-side | Medium | Useful for testing/verification |
| **Keyboard shortcuts** | Power user efficiency | Low | Ctrl+Enter to translate, Ctrl+C to copy result |
| **System tray / minimize to tray** | Stays available without taking space | Low | Quick access icon |
| **Global hotkey** | Translate selected text from any app | Medium | Highlight text, press hotkey, see popup |
| **Character/word count** | Context for translation scope | Low | Input and output counts |
| **Pronunciation / TTS playback** | Helps with language learning | Medium | Uses system TTS or API |
| **Dark/light theme** | Visual preference | Low | Follows system preference |
| **Detected language indicator** | Shows what source language was detected | Low | Builds trust in auto-detect |

## Anti-Features

Features to explicitly NOT build. These waste effort or harm UX.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|---------------------|
| **Cloud account required** | Goes against local AI value prop | Keep everything local |
| **Internet-dependent translation** | Kills the offline-first use case | Ensure local model works fully offline |
| **Subscription/paywall for basic features** | Erodes trust in local app | One-time purchase or free |
| **Excessive permissions** | Privacy concern, suspicious | Request only what's needed |
| **Built-in ads** | Terrible desktop UX | N/A - don't monetize this way |
| **Auto-update that restarts app** | Interrupts workflow | Let users update when convenient |
| **Social sharing buttons** | Desktop apps don't need this | N/A |
| **Bloat features (weather, news)** | Distracts from core task | Stay focused on translation |
| **Forced cloud fallback** | Defeats purpose of local AI | Make local-only the primary path |

## Feature Dependencies

```
Text Input → Language Selection → Translate → Output Display → Copy
                              ↓
                    History (depends on completed translations)
                    Favorites (depends on completed translations)
```

## MVP Recommendation

**Must ship in v1:**
1. Text input with paste support
2. Language selection (Chinese, English, Japanese + auto-detect)
3. Translate button with loading state
4. Translation output display
5. Copy to clipboard
6. Clear/reset function
7. Ollama connection status indicator

**Ship in v1.5 or v2:**
- Translation history
- Keyboard shortcuts
- System tray support
- Dark/light theme
- Global hotkey for selected text

**Do not ship:**
- Cloud integration
- Account system
- Social features
- Any feature requiring internet

## Sources

- General knowledge of translation software landscape (DeepL, Google Translate, Microsoft Translator, Obsidian translate plugins, LocalAI tools)
- Desktop app UX best practices
- Note: Web search unavailable for this research; confidence MEDIUM