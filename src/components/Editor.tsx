import { ChangeCodeMirrorLanguage, CodeBlockEditorDescriptor, ConditionalContents, InsertCodeBlock, InsertSandpack, MDXEditor, MDXEditorMethods, SandpackConfig, ShowSandpackInfo, codeBlockPlugin, codeMirrorPlugin, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, toolbarPlugin, useCodeBlockEditorContext } from "@mdxeditor/editor";
import { invoke } from "@tauri-apps/api";
import { useEffect, useRef, useState } from "react";
const Editor = () => {
  const ref = useRef<MDXEditorMethods>(null)
  const [markdown, setMarkdown] = useState("");
  
  useEffect(() => {
    invoke('get_markdown')
    .then(res => {
      setMarkdown(res as string)
    })
  },[])

  function render() {
    return(
      <div className="border-color-red border border-solid w-[700px]">
        <MDXEditor 
          ref={ref}
          className="outline-none"
          contentEditableClassName="editor"
          markdown={markdown}
          onChange={handleChange}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            quotePlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
          ]}
        />
      </div>
    )
  }

  function handleChange(md: string):string {
    invoke('save_markdown', { text: md });
    return md;
  }

  return render()
}

export default Editor