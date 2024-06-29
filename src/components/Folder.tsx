export default function Folder({ folder }: { folder: FolderType}) {
  console.log(folder)
  return(
    <li 
      className={`cursor-pointer
      `}>
        {/* { isOpen &&
          <ChevronDownIcon height="16px" onClick={handleToggle}/>
        }
        {!isOpen &&
          <ChevronRightIcon height="16px" onClick={handleToggle}/>
        } */}
        <div className="hover:bg-gray-100">
          {folder.name}
        </div>
        <ul>
          {folder.children?.map(child => {
            return <Folder folder={child} />
          })}
        </ul>
        <ul>
          {folder.files?.map(file => {
            if (!file) return null;
            return <li className="text-gray-400 hover:bg-gray-100">{file}</li>
          })}
        </ul>
      </li>
  )
}