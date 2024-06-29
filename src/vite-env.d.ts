/// <reference types="vite/client" />

import { Folder } from "./tauri.types"

declare global {
  type FolderType = Folder & {
    is_open?: boolean,
    is_selected?: boolean,
    in_edit_mode?: boolean
  }
};


const DEFAULT_EDIT_TEXT = 'Untitled folder';
const DATA_ROOT = '/Users/anniesexton/Sites/underscore/data';