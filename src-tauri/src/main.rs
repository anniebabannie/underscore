// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, io};
use serde::{Serialize};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_markdown() -> String {
    let contents = fs::read_to_string("../data/test.md")
        .expect("Should have been able to read the file");
    contents.into()
}

#[tauri::command]
fn save_markdown(text: String) -> bool {
    fs::write("../data/test.md", text).expect("Unable to write file");
    return true;
}

#[tauri::command]
fn get_files_in_directory(root: &str) -> String {
    // Get a list of all entries in the folder
    println!("Running.....");
    let result = fs::read_dir(root);

    // Extract the filenames from the directory entries and store them in a vector
    let file_names: Vec<String> = result.unwrap()
        .filter_map(|entry| {
            let path = entry.ok()?.path();
            if path.is_file() {
                path.file_name()?.to_str().map(|s| s.to_owned())
            } else {
                None
            }
        })
        .collect();
    return serde_json::to_string(&file_names).unwrap();
    // println!("{json}");
    // return file_names
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_markdown, save_markdown, get_files_in_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
