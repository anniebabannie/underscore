import { useEffect, useState } from "react"
import Folder from "./Folder"
import { commands } from "../tauri.types";

export const DEFAULT_ROOT = '/Users/anniesexton/Sites/underscore/data';

export default function FolderList({ showFolderList, showNoteList }: {
  showFolderList?: boolean,
  showNoteList?: boolean,
}) {

  const [folderTree, setFolderTree] = useState<FolderType[]>([]);
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');

  useEffect(() => {
    commands.getDirectories(DEFAULT_ROOT)
    .then(res => {
      setFolderTree(res)
    });
  },[])

  function getSubDirectories(path:string) {
    commands.getDirectories(DEFAULT_ROOT + path)
    .then(res => {
      console.log(DEFAULT_ROOT + path)
      console.log(res)
      // setFolderTree(res)
    });
  }

  return(
    <div className="transition-margin-lefttop ease-in-out duration-200 folder-list-ml list-width"
          style={ (!showFolderList) ? { marginLeft: -240 } : {}}>
      <pre>
      </pre>
      <ul className="list-style-none p-0">
        {folderTree.map((folder, i) => (
          <Folder key={`folder-${i}`} 
          toggleOpen={(path) => getSubDirectories(path)}
          folder={folder}
          selectFolder={(path) => setSelectedFolderPath(path)}
          selected_folder_path={selectedFolderPath}
          />
        ))}
      </ul>
    </div>
  )
}