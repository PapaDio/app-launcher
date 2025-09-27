use serde::{Deserialize, Serialize};
use std::process::Command; // Use std::process::Command instead of tauri::plugin::shell::process::Command

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppItem {
    pub id: String,
    pub name: String,
    pub path: String,
    pub icon: Option<String>,
    pub category: Option<String>,
    pub description: Option<String>,
}

#[cfg(target_os = "windows")]
pub fn detect_installed_apps() -> Vec<AppItem> {
    let mut apps = Vec::new();

    // Method 1: Use the 'where' command to find an executable
    if let Ok(output) = Command::new("where").args(["notepad.exe"]).output() {
        if output.status.success() {
            if let Ok(path) = String::from_utf8(output.stdout) {
                let name = "Notepad".to_string();
                let path_str = path.trim().to_string();
                let id = format!("{}-{}", name, path_str); // Simple unique id
                apps.push(AppItem {
                    id,
                    name,
                    path: path_str,
                    icon: None,
                    category: Some("Utilities".to_string()),
                    description: None, // Added missing field
                });
            }
        }
    }

    // Method 2: Use WMIC to list installed programs (more comprehensive)
    if let Ok(output) = Command::new("wmic")
        .args(["product", "get", "name,InstallLocation", "/format:csv"])
        .output()
    {
        if output.status.success() {
            if let Ok(data) = String::from_utf8(output.stdout) {
                for line in data.lines().skip(2) {
                    // Skip header lines
                    let parts: Vec<&str> = line.split(',').collect();
                    if parts.len() >= 3 {
                        let name = parts[2].trim().to_string();
                        let path = parts[1].trim().to_string();
                        if !name.is_empty() && !path.is_empty() {
                            let id = format!("{}-{}", name, path);
                            apps.push(AppItem {
                                id,
                                name,
                                path,
                                icon: None,
                                category: Some("Applications".to_string()),
                                description: None, // Added missing field
                            });
                        }
                    }
                }
            }
        }
    }

    // Fallback to basic apps if the above methods fail
    if apps.is_empty() {
        let calc_name = "Calculator".to_string();
        let calc_path = "calc.exe".to_string();
        let calc_id = format!("{}-{}", calc_name, calc_path);
        apps.push(AppItem {
            id: calc_id,
            name: calc_name,
            path: calc_path,
            icon: None,
            category: Some("Utilities".to_string()),
            description: None, // Added missing field
        });
        let notepad_name = "Notepad".to_string();
        let notepad_path = "notepad.exe".to_string();
        let notepad_id = format!("{}-{}", notepad_name, notepad_path);
        apps.push(AppItem {
            id: notepad_id,
            name: notepad_name,
            path: notepad_path,
            icon: None,
            category: Some("Utilities".to_string()),
            description: None, // Added missing field
        });
    }

    apps
}

#[cfg(target_os = "macos")]
pub fn detect_installed_apps() -> Vec<AppItem> {
    use std::fs;

    let mut apps = Vec::new();
    let app_dirs = vec![
        "/Applications",
        "/System/Applications",
        format!("{}/Applications", std::env::var("HOME").unwrap_or_default()),
    ];

    for dir in app_dirs {
        if let Ok(entries) = fs::read_dir(&dir) {
            for entry in entries.filter_map(Result::ok) {
                let path = entry.path();
                if path.extension().map_or(false, |ext| ext == "app") {
                    if let Some(name) = path.file_stem().and_then(|s| s.to_str()) {
                        apps.push(AppItem {
                            name: name.to_string(),
                            path: path.to_string_lossy().to_string(),
                            icon: None,
                            category: "Applications".to_string(),
                            description: None,
                        });
                    }
                }
            }
        }
    }

    // Fallback apps for macOS
    if apps.is_empty() {
        apps.push(AppItem {
            name: "Calculator".to_string(),
            path: "/System/Applications/Calculator.app".to_string(),
            icon: None,
            category: Some("Utilities".to_string()),
            description: None,
        });
        apps.push(AppItem {
            name: "TextEdit".to_string(),
            path: "/System/Applications/TextEdit.app".to_string(),
            icon: None,
            category: Some("Utilities".to_string()),
            description: None,
        });
    }

    apps
}

#[cfg(target_os = "linux")]
pub fn detect_installed_apps() -> Vec<AppItem> {
    use std::fs;

    let mut apps = Vec::new();

    // Common Linux application directories
    let app_dirs = vec![
        "/usr/share/applications",
        "/usr/local/share/applications",
        format!(
            "{}/.local/share/applications",
            std::env::var("HOME").unwrap_or_default()
        ),
    ];

    for dir in app_dirs {
        if let Ok(entries) = fs::read_dir(&dir) {
            for entry in entries.filter_map(Result::ok) {
                let path = entry.path();
                if path.extension().map_or(false, |ext| ext == "desktop") {
                    if let Ok(content) = fs::read_to_string(&path) {
                        let mut name = None;
                        let mut exec = None;
                        let mut description = None;

                        for line in content.lines() {
                            if line.starts_with("Name=") {
                                name = Some(line[5..].to_string());
                            } else if line.starts_with("Exec=") {
                                exec = Some(line[5..].to_string());
                            } else if line.starts_with("Comment=") {
                                description = Some(line[8..].to_string());
                            }
                        }

                        if let (Some(app_name), Some(app_exec)) = (name, exec) {
                            apps.push(AppItem {
                                name: app_name,
                                path: app_exec,
                                icon: None,
                                category: "Applications".to_string(),
                                description,
                            });
                        }
                    }
                }
            }
        }
    }

    // Fallback apps for Linux
    if apps.is_empty() {
        apps.push(AppItem {
            name: "Text Editor".to_string(),
            path: "gedit".to_string(),
            icon: None,
            category: Some("Utilities".to_string()),
            description: None,
        });
        apps.push(AppItem {
            name: "Calculator".to_string(),
            path: "gnome-calculator".to_string(),
            icon: None,
            category: Some("Utilities".to_string()),
            description: None,
        });
    }

    apps
}

// Default implementation for other platforms
#[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
pub fn detect_installed_apps() -> Vec<AppItem> {
    vec![AppItem {
        name: "Sample App".to_string(),
        path: "sample".to_string(),
        icon: None,
        category: Some("Utilities".to_string()),
        description: None,
    }]
}
