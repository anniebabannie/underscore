import React, { createContext, useContext, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import Editor from 'rich-markdown-editor';
import { useResizeDetector } from 'react-resize-detector';

import FolderList from "./FolderList";
import NoteList from "./NoteList";
import Search from "./search/Search";
import { DnDContext, DnDState } from "./Dnd";
import EmptyNote from "./empty/EmptyNote";
import Footer from "./footer/Footer";

import { noteActions, utilActions } from "../reducers/actions";

import useReduxState from "../hooks/useReduxState";
import useWindowListeners, { focusEditor } from "../hooks/useWindowListeners";
import useIpcRendererListeners from "../hooks/useIpcRendererListeners";
import Context from "../context/theme-context";
import themes from "../themes/themes";
import { get } from "../helpers";
import { Note, ReduxState } from "../types";
import { Dispatch } from "redux";
import AutoUpdateStatus from "./AutoUpdateStatus";
import ShortcutCheatsheet from "./ShortcutCheatsheet";
import { User } from "../main/schema";
import Profile from "./account/Profile";

const { ipcRenderer } = window;
const UserContext = createContext({});

const App = ({user, userDataPath}: {
  user: User,
  userDataPath: string
}) => {
  const dispatch = useDispatch();
  const context = useContext(Context);
  const editorRef = useRef(null)
  // @ts-ignore
  const { width, ref } = useResizeDetector();

  const state = useReduxState();
  useWindowListeners(state, dispatch);
  useIpcRendererListeners(state, dispatch);

  const prefs = {
    hide_prompt: false
  }

  const currentNote = get(state.notes, state.selected_note_id) as Note;
  let m, lastUpdatedAt;
  if (currentNote) {
    m = new Date(currentNote.updated_at as string)
    lastUpdatedAt = `${m.toLocaleDateString()} ${m.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
  const margins = currentNote ? currentNote.margins : false;

  const DEBOUNCE_TIME = 500; // IMPORTANT: DO NOT MAKE ANY LOWER

  function render() {
    return (
      <Context.Provider value={{
        theme: themes[state.current_theme],
        user,
        userDataPath
      }}>
      <div className="box-border flex flex-row font-sans">
        <div className="titlebar"> </div>
        <DnDContext  onDragUpdate={onDragUpdate} onDrop={onDrop}>
          <div className="transition-margin-lefttop ease-in-out duration-200 folder-list-ml list-width"
            style={ (!state.show_folders || !state.show_notes) ? { marginLeft: -240 } : {}}>
            <Profile user={user} userDataPath={userDataPath} />
            <FolderList
              searching={state.searching}
              folders={state.folders}
              focused={state.focused}
              in_edit_mode={state.in_edit_mode}
              selected_folder_id={state.selected_folder_id}
              hovered_folder_id={state.hovered_folder_id}
              root_ids={state.root_ids}
              dispatch={dispatch}
              folder_just_created={state.folder_just_created}
            />
          </div>
          <div className="transition-margin-lefttop ease-in-out duration-200 note-list-ml"
            style={ state.show_notes ? {} : { marginLeft: -240 }}>
            <NoteList
              notes={state.notes}
              selected_note={state.selected_note_id}
              focused={state.focused}
              selected_folder_id={state.selected_folder_id}
              selected_folder_name={state.folders.filter(f => f.id === state.selected_folder_id)[0]?.name}
              dispatch={dispatch}
              show_folders={state.show_folders}
              orderby={state.orderby}
              show_orderby={state.show_orderby}
              show_notes={state.show_notes}
            />
          </div>
        </DnDContext>
        <div className={`
          ${context.theme.editorBgColor}
          ${(state.show_notes && window.innerWidth > 725) ? "w-11/12" : "w-full"}
          relative scrollview h-screen z-10`}
          ref={ref}
          >
            <div onClick={() => {
              focusNote(state, dispatch)
            }}>
              {
                state.notes.length === 0 &&
                <EmptyNote/>
              }
              <div id="editor"
                // onKeyUp={handleKeyUp}
                ref={editorRef}
                className={`
                  ${context.theme.editorBgColor}
                  mx-10 mb-8 mt-16 ${(state.notes.length === 0) ? " hidden " : ""}`}>
                  {/* <div className="mb-20 border">
                    <CustomEditor/>
                  </div> */}
                  <Editor
                    defaultValue={state.actual_default_body || " "}
                    key={state.selected_note_id} // necessary to make note update value when creating new note more than once in a row and clearing the editor
                    value={state.actual_default_body}
                    placeholder={"Write your note..."}
                    onChange={handleChange}
                    readOnly={(state.show_prefs || state.searching)}
                    // uploadImage={async file => handleImageUpload(file)}
                    // theme={context.theme.editor}
                    className={`
                      my-0 mx-auto max-w-prose pb-96 ${prefs.hide_prompt ? 'prefs-hide-prompt': ''} ${margins ? 'margins': ''} `}
                    />
                    <div className="pb-96"></div>
            </div>
          </div>

          <div style={{ bottom: 0, position: 'fixed', marginRight: 0, marginLeft: 0, width: width }}>
            <Footer
              className=""
              body={state.body}
              actual_default_body={state.actual_default_body}
              show_footer={state.show_footer}
              last_updated_at={lastUpdatedAt}
              // word_count_goal={currentNote ? currentNote.word_count_goal : null}
              // word_count_deadline={currentNote ? currentNote.word_count_deadline : null}
              // word_count_start={currentNote ? currentNote.word_count_start : null}
              // dispatch={dispatch}
              // note_id={currentNote ? currentNote.id : null}
            />
          </div>
        </div>
        <div className="absolute top-6 right-6 z-10 text-gray-400 cursor-pointer hover:text-gray-500" onClick={() => setShowCheatsheet(true)}>⌘ ?</div>
        <ShortcutCheatsheet visible={showCheatsheet} setShowCheatsheet={setShowCheatsheet} />
        <Search searching={state.searching} dispatch={dispatch}/>
        {/* <Prefs visible={state.show_prefs} dispatch={dispatch}/> */}
        {state.autoUpdateAvailable && 
          <AutoUpdateStatus percentageDownloaded={state.autoUpdateDownloadPercentage || 0} downloadComplete={state.autoUpdateComplete || false }/>
        }
      </div>
      </Context.Provider>
    );
  }

  // const blobToBase64 = (blob: Blob) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(blob);
  //   return new Promise(resolve => {
  //     reader.onloadend = () => {
  //       resolve(reader.result);
  //     };
  //   });
  // }

  // const handleImageUpload = async (file: Blob) => {
  //   const base64 = await blobToBase64(file);
  //   const base64Data = base64.replace(/^data:image\/png;base64,/, "");
  //   return await ipcRenderer.invoke('upload-image', { noteId: state.selected_note_id, base64Data: base64Data });
  // }

  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false)

  const onDragUpdate = (data: DnDState) => {
    // for custom DnD
    if (!data.isDraggingOver) return;
    dispatch(utilActions.setHoveredFolderId(data.isDraggingOver));
  }

  const onDrop = (data: DnDState) => {
    // for custom DnD
    dispatch(utilActions.setHoveredFolderId(''));
    if (!data.isDraggingOver || !data.isDragging || data.dragCanceled) return;
    dispatch(noteActions.updateNote({ id: data.isDragging, folder_id: data.isDraggingOver, movedFolders: true }))
  }

  const focusNote = (state: ReduxState, dispatch: Dispatch) => {
    if (state.notes.length > 0) {
      dispatch(utilActions.focused('note'))
      focusEditor()
    }
  }

  // function getCursorIndex(element: HTMLElement) {
  //   let position = 0;
  //   const isSupported = typeof window.getSelection !== "undefined";
  //   if (isSupported) {
  //     const selection = window.getSelection() as Selection;
  //     if (selection.rangeCount !== 0) {
  //       const range = selection.getRangeAt(0);
  //       const preCaretRange = range.cloneRange();
  //       preCaretRange.selectNodeContents(element);
  //       preCaretRange.setEnd(range.endContainer, range.endOffset);
  //       position = preCaretRange.toString().length;
  //     }
  //   }
  //   return position;
  // }

  // const handleKeyUp = e => {
  //   const index = getCursorIndex(editorRef.current);
  // }

  const handleChange = debounce(value => {
    const markdown = value();
    dispatch(utilActions.setBody(markdown))
    ipcRenderer.send('notes-update', { note_id: state.selected_note_id, props: { body: markdown } })
  }, DEBOUNCE_TIME);

  return render()
}

export default App;
