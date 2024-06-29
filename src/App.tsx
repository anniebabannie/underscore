import "./App.css";
import Editor from "./components/Editor";
import FolderList from "./components/FolderList";

function App() {
  return (
    <div className="box-border flex flex-row font-sans">
      <div className="titlebar"> </div>
        <FolderList showFolderList={true}/>
        <Editor />
    </div>
  );
}

export default App;
