/// <reference types="vite/client" />

type Folder = {
  id: string,
  name:string,
  is_collapsed?:boolean,
  in_edit_mode?:boolean
}

const DEFAULT_EDIT_TEXT = 'Untitled folder'