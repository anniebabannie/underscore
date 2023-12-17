// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import { invoke } from '@tauri-apps/api'
import FolderList from "./components/FolderList";

function App() {
  const [markdown, setMarkdown] = useState("");
  const folders:Folder[] = [
    {
      id: '123sdaf1',
      name: 'personal',
    }
  ]
  
  useEffect(() => {
    invoke('get_markdown')
    .then(res => {
      setMarkdown(res as string)
    })
  },[])

  function getDirTree() {
    invoke('get_files_in_directory', {
      root: '/Users/anniesexton/Sites/underscore/data'
    })
    .then(res => {
      console.log(res)
    })
  }

  return (
    <div className="box-border flex flex-row font-sans">
      <div className="titlebar"> </div>
        <button onClick={getDirTree}>Get tree</button>
        <FolderList folders={folders} showFolderList={true}/>
        <Editor markdown={markdown}/>
    </div>
  );
}

export default App;
