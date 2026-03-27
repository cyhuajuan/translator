---
phase: quick
plan: "260327-mno"
type: execute
wave: 1
depends_on: []
files_modified:
  - src-tauri/src/lib.rs
autonomous: true
requirements:
  - PROMPT-01
must_haves:
  truths:
    - "Translation uses official model prompt format"
  artifacts:
    - path: src-tauri/src/lib.rs
      provides: Updated translate command prompt
      contains: "Your goal is to accurately convey"
  key_links:
    - from: src-tauri/src/lib.rs
      to: Ollama API
      via: prompt string
      pattern: "format!.*prompt"
---

<objective>
更新翻译提示词以匹配 translategemma 模型的官方要求格式。
</objective>

<context>
@src-tauri/src/lib.rs (lines 50-56)
</context>

<tasks>

<task type="auto">
  <name>Task 1: 更新翻译提示词格式</name>
  <files>src-tauri/src/lib.rs</files>
  <action>
    在 `src-tauri/src/lib.rs` 第 52-55 行找到当前的 prompt format，将其替换为官方模型要求的格式：

    ```rust
    let prompt = format!(
        "You are a professional {0} ({1}) to {2} ({3}) translator. Your goal is to accurately convey the meaning and nuances of the original {0} text while adhering to {2} grammar, vocabulary, and cultural sensitivities.\nProduce only the {2} translation, without any additional explanations or commentary. Please translate the following {0} text into {2}:\n\n{4}",
        source_display, source_lang, target_display, target_lang, text
    );
    ```

    注意：使用位置参数 {0}, {1}, {2}, {3}, {4} 因为 source_display 和 source_lang 在字符串中重复出现多次（{0} 和 {1} 对应 source，{2} 和 {3} 对应 target，{4} 对应 text）。
  </action>
  <verify>
    <automated>cargo check --manifest-path src-tauri/Cargo.toml 2>&1 | head -20</automated>
  </verify>
  <done>提示词已更新为官方格式，包含 "Your goal is to accurately convey" 和 "Produce only the {TARGET_LANG} translation"</done>
</task>

</tasks>

<verification>
cargo check 通过，无编译错误
</verification>

<success_criteria>
提示词格式已更新为官方要求，包含完整的翻译指导说明
</success_criteria>

<output>
完成后创建 `.planning/quick/260327-mno/260327-mno-SUMMARY.md`
</output>
