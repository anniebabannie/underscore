import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction, useRef } from "react";
import ContentEditable from "react-contenteditable"

export default function Folder({ folder, selected_folder_path, selectFolder, toggleOpen, searching }:{
  folder: FolderType,
  selectFolder: Dispatch<SetStateAction<string>>,
  toggleOpen: (path:string) => void,
  selected_folder_path?: string,
  searching?:boolean
}) {
  const DEFAULT_EDIT_TEXT = 'Untitled folder'
  let default_text = (folder.name !== DEFAULT_EDIT_TEXT) ? folder.name : DEFAULT_EDIT_TEXT;
  const text = useRef(default_text)
  const isOpen = useRef(folder.relative_path === selected_folder_path);

  // function handleToggle() {
  //   if (isOpen.current) {
  //     isOpen.current = false;
  //   } else {
  //     toggleOpen(folder.relative_path);
  //   }
  // }

  // function traverseFolderTree(folder:FolderType, path:string) {
  // }

  return(
    <li 
    className={`
    flex items-center cursor-pointer
    ${isOpen ? "bg-gray-300": "bg-white"}
    `}>
      {/* { isOpen &&
        <ChevronDownIcon height="16px" onClick={handleToggle}/>
      }
      {!isOpen &&
        <ChevronRightIcon height="16px" onClick={handleToggle}/>
      } */}
      <div 
      onClick={() => selectFolder(folder.relative_path)}
      >
        {folder.name}
      </div>
    </li>
  )
}