import { fetch } from "@tauri-apps/plugin-http";
import type { TranslationService } from "@/hooks/useSettings";

export interface TranslateOptions {
  text: string;
  sourceLang: string;
  targetLang: string;
  service: TranslationService;
  systemPrompt: string;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

/**
 * Language info mapping: Chinese display name → English name + ISO code.
 */
const LANG_INFO: Record<string, { english: string; code: string }> = {
  "中文": { english: "Chinese", code: "zh-CN" },
  "英文": { english: "English", code: "en" },
  "日文": { english: "Japanese", code: "ja" },
  "韩文": { english: "Korean", code: "ko" },
};

/**
 * Replace template variables in the system prompt.
 *
 * Supported variables:
 *  - {{sourceLang}}     → English name (e.g. "Chinese")
 *  - {{targetLang}}     → English name (e.g. "English")
 *  - {{sourceLangCode}} → ISO code (e.g. "zh-CN")
 *  - {{targetLangCode}} → ISO code (e.g. "en")
 */
export function resolveSystemPrompt(
  template: string,
  sourceLang: string,
  targetLang: string
): string {
  const srcInfo = LANG_INFO[sourceLang] ?? { english: sourceLang, code: sourceLang };
  const tgtInfo = LANG_INFO[targetLang] ?? { english: targetLang, code: targetLang };

  return template
    .replace(/\{\{sourceLang\}\}/g, srcInfo.english)
    .replace(/\{\{targetLang\}\}/g, tgtInfo.english)
    .replace(/\{\{sourceLangCode\}\}/g, srcInfo.code)
    .replace(/\{\{targetLangCode\}\}/g, tgtInfo.code);
}

/**
 * Filters out <think>...</think> blocks from streamed text.
 * Handles partial tags that may be split across chunks.
 */
class ThinkingFilter {
  private insideThink = false;
  private pendingBuffer = "";
  private hasEmitted = false;

  process(chunk: string): string {
    let input = this.pendingBuffer + chunk;
    this.pendingBuffer = "";
    let output = "";

    while (input.length > 0) {
      if (this.insideThink) {
        const closeIdx = input.indexOf("</think>");
        if (closeIdx === -1) {
          // Still inside <think>, discard all and check for partial tag
          const partialIdx = input.lastIndexOf("<");
          if (partialIdx !== -1 && partialIdx > input.length - 9) {
            this.pendingBuffer = input.slice(partialIdx);
          }
          break;
        }
        // Skip everything up to and including </think>
        input = input.slice(closeIdx + 8);
        this.insideThink = false;
      } else {
        const openIdx = input.indexOf("<think>");
        if (openIdx === -1) {
          // No <think> tag — check for potential partial tag at end
          const partialIdx = input.lastIndexOf("<");
          if (partialIdx !== -1 && partialIdx > input.length - 8) {
            output += input.slice(0, partialIdx);
            this.pendingBuffer = input.slice(partialIdx);
          } else {
            output += input;
          }
          break;
        }
        // Output everything before <think>, then enter thinking mode
        output += input.slice(0, openIdx);
        input = input.slice(openIdx + 7);
        this.insideThink = true;
      }
    }

    // Trim leading whitespace until we've emitted real content
    if (!this.hasEmitted) {
      output = output.replace(/^[\s\n\r]+/, "");
      if (output.length > 0) {
        this.hasEmitted = true;
      }
    }

    return output;
  }

  /** Flush any remaining buffered content (call at stream end). */
  flush(): string {
    const remaining = this.pendingBuffer;
    this.pendingBuffer = "";
    return this.insideThink ? "" : remaining;
  }
}

/**
 * Parse a single SSE line and extract the content delta.
 * Returns the content string or null if not a content event.
 * Ignores `reasoning_content` field used by some APIs for chain-of-thought.
 */
function parseSSELine(line: string): string | null {
  if (!line.startsWith("data: ")) return null;
  const data = line.slice(6).trim();
  if (data === "[DONE]") return null;

  try {
    const parsed = JSON.parse(data);
    const delta = parsed.choices?.[0]?.delta;
    if (!delta) return null;
    // Only return actual content, skip reasoning_content
    return delta.content ?? null;
  } catch {
    return null;
  }
}

/**
 * Core translation function using OpenAI-compatible Chat Completions API.
 * Supports SSE streaming for real-time output.
 */
export async function translateText(options: TranslateOptions): Promise<string> {
  const { text, service, systemPrompt, onChunk, signal } = options;

  if (!text.trim()) {
    throw new Error("翻译文本不能为空");
  }

  if (!service.apiKey) {
    throw new Error("请先在设置中配置 API Key");
  }

  if (!service.apiUrl) {
    throw new Error("请先在设置中配置 API Base URL");
  }

  // Build full endpoint URL from base URL
  const baseUrl = service.apiUrl.replace(/\/+$/, "");
  const endpoint = baseUrl.endsWith("/chat/completions")
    ? baseUrl
    : `${baseUrl}/chat/completions`;

  const body = JSON.stringify({
    model: service.model,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${service.apiKey}`,
    },
    body,
    signal,
  });

  if (!response.ok) {
    let errorMsg = `API 请求失败 (${response.status})`;
    try {
      const errorBody = await response.text();
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        errorMsg = parsed.error.message;
      }
    } catch {
      // Use generic error message
    }
    throw new Error(errorMsg);
  }

  if (!response.body) {
    throw new Error("响应体为空");
  }

  // Read SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const thinkingFilter = new ThinkingFilter();
  let fullText = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const content = parseSSELine(trimmed);
        if (content) {
          const filtered = thinkingFilter.process(content);
          if (filtered) {
            fullText += filtered;
            onChunk(filtered);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const content = parseSSELine(buffer.trim());
      if (content) {
        const filtered = thinkingFilter.process(content);
        if (filtered) {
          fullText += filtered;
          onChunk(filtered);
        }
      }
    }

    // Flush any remaining content from the filter
    const flushed = thinkingFilter.flush();
    if (flushed) {
      fullText += flushed;
      onChunk(flushed);
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

