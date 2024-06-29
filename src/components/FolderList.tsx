import { useEffect, useState } from "react"
import Folder from "./Folder"
import { commands } from "../tauri.types";

export const DEFAULT_ROOT = '/Users/anniesexton/Sites/underscore/data';


// const folderTree:FolderType[] = [
//   {
//     name: 'Folder 1',
//     files: ['file1.txt', 'file2.txt'],
//     children: [
//       {
//         name: 'Folder 1.1',
//         children: [
//           {
//             name: 'Folder 1.1.1',
//             children: [],
//             files: ['file1.txt', 'file2.txt'],
//             relative_path: '/Folder 1/Folder 1.1/Folder 1.1.1'
//           }
//         ],
//         files: [],
//         relative_path: '/Folder 1/Folder 1.1'
//       },
//       {
//         name: 'Folder 1.2',
//         children: [],
//         files: [],
//         relative_path: '/Folder 1/Folder 1.2'
//       }
//     ],
//     relative_path: '/Folder 1'
//   },
//   {
//     name: 'Folder 2',
//     children: [],
//     files: [],
//     relative_path: '/Folder 2'
//   }
// ]
export default function FolderList({ showFolderList, showNoteList }: {
  showFolderList?: boolean,
  showNoteList?: boolean,
}) {

  const [folderTree, setFolderTree] = useState<FolderType[]>([]);
  // const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
  // console.log(selectedFolderPath)

  useEffect(() => {
    commands.getDirectories(DEFAULT_ROOT)
    .then(res => {
      console.log('res', res);
      setFolderTree(res)
    });
  },[])

  function getSubDirectories(path:string) {
    commands.getDirectories(DEFAULT_ROOT + path)
    .then(res => {
      console.log(DEFAULT_ROOT + path)
      console.log(res)
      setFolderTree(res)
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
          // toggleOpen={(path) => getSubDirectories(path)}
          folder={folder}
          // selectFolder={(path) => setSelectedFolderPath(path)}
          // selected_folder_path={selectedFolderPath}
          />
        ))}
      </ul>
    </div>
  )
}