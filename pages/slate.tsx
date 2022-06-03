import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';


export default function MyEditor() {
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(),);

    function hanldeKeyCommand(command: string, editorState: EditorState): DraftHandleValue {
        const newState = RichUtils.handleKeyCommand(editorState, command)

        if (newState) {
            setEditorState(newState)
            return 'handled'
        }
        return 'not-handled'
    }
    function onBoldClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }
    function onItalClick() {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
    }

    return (
        <div>
            <button onClick={onBoldClick} >Bold</button>
            <button onClick={onItalClick} >Bold</button>
            <Editor
                handleKeyCommand={hanldeKeyCommand}
                editorState={editorState}
                onChange={setEditorState}
            />
            <button onClick={() => console.log(editorState.getCurrentContent())} >Submit</button>
            <div>
                {editorState.getCurrentContent().getPlainText()}
            </div>
        </div>
    );
}