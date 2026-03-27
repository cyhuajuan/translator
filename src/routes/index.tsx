import * as React from "react"
import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { Loader2, ArrowUpDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LANGUAGES, type Language } from '@/lib/languages'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [sourceLang, setSourceLang] = React.useState<string>("en")
  const [targetLang, setTargetLang] = React.useState<string>("zh")
  const [sourceText, setSourceText] = React.useState<string>("")
  const [targetText, setTargetText] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleTranslate = React.useCallback(async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setIsLoading(true)
    setError(null)
    setTargetText("")

    try {
      // Check Ollama connection
      const isConnected = await invoke<boolean>("check_ollama_connection")
      if (!isConnected) {
        setError("Ollama is not running. Please start Ollama and try again.")
        setIsLoading(false)
        return
      }

      // Check model availability
      const modelAvailable = await invoke<boolean>("check_model_availability")
      if (!modelAvailable) {
        setError("translategemma model is not available. Please run: ollama pull translategemma")
        setIsLoading(false)
        return
      }

      // Perform translation
      const result = await invoke<string>("translate", {
        sourceLang,
        targetLang,
        text: sourceText,
      })
      setTargetText(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }, [sourceLang, targetLang, sourceText])

  const handleSwap = React.useCallback(() => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(targetText)
    setTargetText(sourceText)
  }, [sourceLang, targetLang, sourceText, targetText])

  const handleClear = React.useCallback(() => {
    setSourceText("")
    setTargetText("")
    setError(null)
  }, [])

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div className="flex items-center gap-2">
        <Select
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="w-36"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSwap}
          disabled={isLoading}
          aria-label="Swap languages"
        >
          <ArrowUpDown className="size-4" />
        </Button>
        <Select
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-36"
        />
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <Textarea
          placeholder="Enter text to translate..."
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="flex-1 resize-none"
          disabled={isLoading}
        />
        <Textarea
          placeholder="Translation will appear here..."
          value={targetText}
          readOnly
          className="flex-1 resize-none"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive px-2">{error}</div>
      )}

      <div className="flex items-center gap-2">
        <Button
          onClick={handleTranslate}
          disabled={isLoading}
          className="min-w-32"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Translate"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
        >
          <Trash2 className="size-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  )
}
