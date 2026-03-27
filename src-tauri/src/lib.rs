use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Serialize, Deserialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(Deserialize)]
struct OllamaResponse {
    response: String,
}

#[derive(Deserialize)]
struct OllamaTagsResponse {
    models: Vec<OllamaModel>,
}

#[derive(Deserialize)]
struct OllamaModel {
    name: String,
}

// Language codes for Ollama API
const LANGUAGE_CODES: &[(&str, &str)] = &[
    ("zh", "Chinese"),
    ("en", "English"),
    ("ja", "Japanese"),
];

fn get_lang_display(code: &str) -> &str {
    LANGUAGE_CODES
        .iter()
        .find(|(c, _)| c == code)
        .map(|(_, name)| *name)
        .unwrap_or(code)
}

#[tauri::command]
async fn translate(source_lang: String, target_lang: String, text: String) -> Result<String, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .map_err(|e| e.to_string())?;

    let source_display = get_lang_display(&source_lang);
    let target_display = get_lang_display(&target_lang);

    let prompt = format!(
        "You are a professional {} ({}) to {} ({}) translator. Provide only the translated text without explanations or notes.\n\n{}",
        source_display, source_lang, target_display, target_lang, text
    );

    let request_body = OllamaRequest {
        model: "translategemma".to_string(),
        prompt,
        stream: false,
    };

    let response = client
        .post("http://localhost:11434/api/generate")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Ollama: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Ollama API returned error: {}", response.status()));
    }

    let result: OllamaResponse = response.json().await.map_err(|e| e.to_string())?;

    Ok(result.response.trim().to_string())
}

#[tauri::command]
async fn check_ollama_connection() -> Result<bool, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    match client.get("http://localhost:11434").send().await {
        Ok(resp) => Ok(resp.status().is_success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn check_model_availability() -> Result<bool, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    let response = client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Ollama: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Ollama API returned error: {}", response.status()));
    }

    let result: OllamaTagsResponse = response.json().await.map_err(|e| e.to_string())?;

    let model_available = result.models.iter().any(|m| m.name.starts_with("translategemma"));

    Ok(model_available)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            translate,
            check_ollama_connection,
            check_model_availability
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
