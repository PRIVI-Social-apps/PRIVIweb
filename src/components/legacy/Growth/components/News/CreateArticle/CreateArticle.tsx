import React, { useState, useEffect } from "react";
// import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";

export default function CreateNew() {
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editor: any = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  useEffect(() => {
    focusEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   showContent();
  // }, [editorState]);

  // const showContent = () => {
  //   console.log(
  //     editorState.getCurrentContent(),
  //     convertToRaw(editorState.getCurrentContent())
  //   );
  //   const editorJSON = JSON.stringify(
  //     convertToRaw(editorState.getCurrentContent())
  //   );
  //   console.log(editorJSON);
  // };

  // const onChange = (editorState) => {
  //   setEditorState(editorState);
  // };

  // const handleKeyCommand = (command) => {
  //   const newState = RichUtils.handleKeyCommand(editorState, command);
  //   if (newState) {
  //     onChange(newState);
  //     return "handled";
  //   }
  //   return "not-handled";
  // };

  // const onUnderlineClick = () => {
  //   onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  // };

  // const onBoldClick = () => {
  //   onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  // };

  // const onItalicClick = () => {
  //   onChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  // };

  // const onLineThroughClick = () => {
  //   onChange(RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH"));
  // };

  return (
    <div>
      <div className="inputPost">
        <div className="textEditorPost">
          {/* <button className="textEditorButtonPost" onClick={onUnderlineClick}>
            <u>U</u>
          </button>
          <button className="textEditorButtonPost" onClick={onBoldClick}>
            <b>B</b>
          </button>
          <button className="textEditorButtonPost" onClick={onItalicClick}>
            <em>I</em>
          </button>
          <button className="textEditorButtonPost" onClick={onLineThroughClick}>
            <span style={{ textDecoration: "line-through" }}>T</span>
          </button> */}
        </div>
        <div className="editors">
          <div onClick={focusEditor} className="cursor-pointer">
            {/* <Editor
              ref={editor}
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              onChange={(editorState) => onChange(editorState)}
            /> */}
          </div>
        </div>
      </div>
      {/* <button onClick={showContent}>finish</button> */}
    </div>
  );
}
