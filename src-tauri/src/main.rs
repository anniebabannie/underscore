// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::{self, DirEntry}, io, path::{PathBuf, Path}, ffi::{OsString, OsStr}};
use serde::{Serialize, Deserialize};
use specta::{Type, ts::export};
use tauri_specta::{*, ts};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_markdown() -> String {
    let contents = fs::read_to_string("../data/test.md");
        // .expect("Should have been able to read the file");
    contents.unwrap()
}

#[tauri::command]
fn save_markdown(text: &str) -> bool {
    fs::write("../data/test.md", text).expect("Unable to write file");
    return true;
}

#[tauri::command]
#[specta::specta]
fn get_directories(root: &str) -> Vec<Folder> {
    let mut dir_content: Vec<Folder> = Vec::new();
    let paths = fs::read_dir(root).unwrap();

    for entry in paths {
        let dir = entry.unwrap().path();
        if dir.is_dir() {
            let folder = Folder {
                name: dir.file_name().unwrap().to_string_lossy().into_owned(),
                children: Vec::new()
            };
            dir_content.push(folder)
        }
        //  else if is_markdown_file(&dir) {
        //     println!("file: {:?}", &dir);
        //     dir_content.push(dir.file_name().unwrap().to_string_lossy().into_owned())
        // }

    };

    dir_content
}

#[derive(Serialize, Type)]
pub struct Folder {
    pub name: String,
    pub children: Vec<Folder>
}

fn is_markdown_file(path: &Path) -> bool {

    if !path.is_file() {return false}

    if let Some(extension) = path.extension() {
        if extension == "md" {return true}  
    }

    if path.to_str() == Some("README") {return true}

    false
}

// #[derive(Serialize, Deserialize, Debug, Clone, specta::Type, tauri_specta::Event)]
// pub struct DemoEvent(String);

// #[derive(Serialize, Deserialize, Debug, Clone, specta::Type, tauri_specta::Event)]
// pub struct EmptyEvent;

fn main() {
    let specta_builder = {;
        let specta_builder = ts::builder()
            .commands(tauri_specta::collect_commands![
                get_directories
            ])
            // .events(tauri_specta::collect_events![DemoEvent, EmptyEvent])
            .config(specta::ts::ExportConfig::default().formatter(specta::ts::formatter::prettier));

        #[cfg(debug_assertions)]
        let specta_builder = specta_builder.path("../src/tauri.types.ts");

        specta_builder.into_plugin()
    };

    tauri::Builder::default()
    .plugin(specta_builder)
    // .setup(|app| {
    //     // let handle = app.handle();

    //     // DemoEvent::listen_global(&handle, |event| {
    //     //     dbg!(event.payload);
    //     // });

    //     // DemoEvent("Test".to_string()).emit_all(&handle).ok();

    //     // EmptyEvent::listen_global(&handle, {
    //     //     let handle = handle.clone();
    //     //     move |_| {
    //     //         EmptyEvent.emit_all(&handle).ok();
    //     //     }
    //     // });

    //     Ok(())
    // })
    .invoke_handler(tauri::generate_handler![get_markdown, save_markdown, get_directories])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
