import Folder from "./Folder"

export default function FolderList({ showFolderList, showNoteList, folders }: {
  showFolderList?: boolean,
  showNoteList?: boolean,
  folders: Folder[],
}) {
  return(
    <div className="transition-margin-lefttop ease-in-out duration-200 folder-list-ml list-width"
          style={ (!showFolderList) ? { marginLeft: -240 } : {}}>
      <pre>
      </pre>
      <ul>
        {folders.map((folder, i) => (
          <Folder key={`folder-${i}`} folder={folder}/>
        ))}
      </ul>
    </div>
  )
}