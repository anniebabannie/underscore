import { ChangeCodeMirrorLanguage, CodeBlockEditorDescriptor, ConditionalContents, InsertCodeBlock, InsertSandpack, MDXEditor, MDXEditorMethods, SandpackConfig, ShowSandpackInfo, codeBlockPlugin, codeMirrorPlugin, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, toolbarPlugin, useCodeBlockEditorContext } from "@mdxeditor/editor";
import { invoke } from "@tauri-apps/api";
import { useRef } from "react";
const Editor = ({markdown}:{markdown: string}) => {
  const ref = useRef<MDXEditorMethods>(null)
  function render() {
    return(
      <div>
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