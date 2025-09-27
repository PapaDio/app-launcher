#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_detector;

use app_detector::{detect_installed_apps, AppItem};

use std::sync::Mutex;
use std::fs::File;
use std::io::prelude::*;
// use serde::{Serialize, Deserialize};

use tauri::Manager;
use tauri::State;
use tauri_plugin_opener;
use tauri_plugin_fs;
use tauri_plugin_shell;
use tauri_plugin_store;

struct AppState {
    apps: Mutex<Vec<AppItem>>,
}

#[tauri::command]
async fn add_custom_app(
    new_app: AppItem, // Your AppItem struct needs to derive Deserialize
    state: State<'_, AppState>
) -> Result<AppItem, String> { // Return the added app on success

    // 1. Lock the mutex to access the apps vector
    let mut apps_guard = state.apps.lock().map_err(|e| e.to_string())?;
    
    // 2. Add the new app to the vector
    apps_guard.push(new_app.clone());
    
    // 3. Save the entire updated list to a file
    save_apps_to_file(&*apps_guard).map_err(|e| e.to_string())?;
    
    // 4. Release the lock and return the added app
    Ok(new_app)
}

// Helper function to save the app list to a JSON file
fn save_apps_to_file(apps: &[AppItem]) -> std::io::Result<()> {
    let serialized = serde_json::to_string_pretty(apps)?;
    let mut file = File::create("custom_apps.json")?;
    file.write_all(serialized.as_bytes())?;
    Ok(())
}

fn load_apps_from_file() -> Result<Vec<AppItem>, std::io::Error> {
    let file_content = std::fs::read_to_string("custom_apps.json")?;
    let apps: Vec<AppItem> = serde_json::from_str(&file_content)?;
    Ok(apps)
}

#[tauri::command]
async fn get_installed_apps() -> Result<Vec<AppItem>, String> {
    // Only load custom apps for GUI display
    match load_apps_from_file() {
        Ok(apps) => Ok(apps),
        Err(_) => Ok(Vec::new()),
    }
}

#[tauri::command]
async fn remove_custom_app(app_id: String) -> Result<(), String> {
    let mut apps = load_apps_from_file().map_err(|e| e.to_string())?;
    let original_len = apps.len();
    apps.retain(|app| app.id != app_id);
    if apps.len() == original_len {
        return Err("App not found".to_string());
    }
    save_apps_to_file(&apps).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn edit_custom_app(app_id: String, updated_app: AppItem) -> Result<(), String> {
    let mut apps = load_apps_from_file().map_err(|e| e.to_string())?;
    let mut found = false;
    for app in &mut apps {
        if app.id == app_id {
            *app = updated_app.clone();
            found = true;
            break;
        }
    }
    if !found {
        return Err("App not found".to_string());
    }
    save_apps_to_file(&apps).map_err(|e| e.to_string())?;
    Ok(())
}


#[tauri::command]
async fn launch_app(app_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        // Try to launch the app
        if let Err(e) = Command::new(&app_path).spawn() {
            return Err(format!("Failed to launch app: {}", e));
        }
        Ok(())
    }
    #[cfg(not(target_os = "windows"))]
    {
        // For other OS, just return Ok for now
        Ok(())
    }
}

#[tauri::command]
async fn search_apps(query: String) -> Result<Vec<AppItem>, String> {
    let apps = detect_installed_apps();
    if query.is_empty() {
        return Ok(apps);
    }

    let query_lower = query.to_lowercase();
    let filtered = apps
        .into_iter()
        .filter(|app| app.name.to_lowercase().contains(&query_lower))
        .collect();

    Ok(filtered)
}

#[tauri::command]
async fn refresh_apps(state: State<'_, AppState>) -> Result<Vec<AppItem>, String> {
    let new_apps = detect_installed_apps();
    let mut apps = state.apps.lock().map_err(|e| e.to_string())?;
    *apps = new_apps.clone();
    Ok(new_apps)
}

#[tauri::command]
async fn get_app_categories(state: State<'_, AppState>) -> Result<Vec<String>, String> {
    let apps = state.apps.lock().map_err(|e| e.to_string())?;
    let mut categories: Vec<String> = apps
        .iter()
        .filter_map(|app| app.category.clone())
        .collect();
    
    categories.sort();
    categories.dedup();
    Ok(categories)
}

#[tauri::command]
fn ping() -> String {
    "pong".into()
}

fn main() {
    let mut initial_apps = load_apps_from_file().unwrap_or_else(|_| Vec::new());
    
    initial_apps.extend(detect_installed_apps());

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            apps: Mutex::new(initial_apps),
        })
        .invoke_handler(tauri::generate_handler![
            get_installed_apps,
            launch_app,
            search_apps,
            refresh_apps,
            get_app_categories,
            add_custom_app,
            remove_custom_app,
            edit_custom_app,
            ping
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                // Use the Manager trait's method to get the window
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
