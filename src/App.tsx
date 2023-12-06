// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { MDXEditor, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin } from "@mdxeditor/editor";

function App() {
  return (
    <div className="border-red-600 border-4">
      <MDXEditor markdown='' plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        quotePlugin(),
        markdownShortcutPlugin()
      ]} />
    </div>
  );
}

export default App;
