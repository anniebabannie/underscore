import { MDXEditor, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin } from "@mdxeditor/editor";
const Editor = () => {
  function render() {
    return(
      <div>
        <MDXEditor markdown='' plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          quotePlugin(),
          markdownShortcutPlugin()
        ]} />
      </div>
    )
  }

  return render()
}

export default Editor