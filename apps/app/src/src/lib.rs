// use tauri::{window::WindowBuilder, Manager};
// use tauri::{webview::WebviewWindowBuilder, WebviewUrl};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let port = 8080;

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
