import { useRef } from "react";
import _debounce from "lodash/debounce";
import ContentEditable from "react-contenteditable"

export default function Folder({ folder, searching }:{
  folder: Folder,
  searching?:boolean
}) {
  const DEFAULT_EDIT_TEXT = 'Untitled folder'
  let default_text = (folder.name !== DEFAULT_EDIT_TEXT) ? folder.name : DEFAULT_EDIT_TEXT;
  const text = useRef(default_text)

  function getFolderText(folder: Folder) {
    if (folder.in_edit_mode) {
      return text.current
    } else {
      return folder.name;
    }
  }

  const handleChange = _debounce(e => {
    text.current = e.target.value
  }, 50);

  function handleBlur(_e: any) {
    // dispatch(folderActions.updateFolder({ folder_name: text.current, subaction: folder_just_created }))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.code === 'Enter' && !searching) {
      e.preventDefault();
      // dispatch(folderActions.updateFolder({ folder_name: text.current, subaction: folder_just_created }))
    }
  }

  return(
    <li
      // style={{ paddingLeft: PADDING*level }}
      className={`
        ${(!folder.is_collapsed ? ' open-folder ' : ' ')
        }` }
      >
        <div
          data-folder-id={folder.id}
          // onClick={selectFolder}
          className={`relative
            px-4 py-0.5 rounded-sm
            my-0.5
            transition-colors
            duration-75
            `}
        >
        {/* {getCaret()} */}
        <ContentEditable
          className={`
            p-0.5 content-box ${(!folder.in_edit_mode) ? 'select-none' : `text-gray-800 bg-white rounded-sm`}
            `}
          id={'folder-' + folder.id}
          html={getFolderText(folder)}
          disabled={!folder.in_edit_mode}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        </div>
      </li>
  )
}