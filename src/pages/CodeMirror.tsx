import { javascript } from '@codemirror/lang-javascript'
import { EditorView, basicSetup } from 'codemirror'
import { useState, useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'

const initialDoc = `new EditorView({
  parent: mountEl.current!,
  state: EditorState.create({
    doc: 'Hello World',
    extensions: [keymap.of(defaultKeymap)]
  }),
  extensions: [
    javascript({
      typescript: true
    })
  ]
})`

const Editor = () => {
  let created = false
  const mountEl = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<EditorView>()

  useEffect(() => {
    if (!created && mountEl && !editor) {
      setEditor(
        new EditorView({
          parent: mountEl.current!,
          state: EditorState.create({
            doc: initialDoc
          }),
          extensions: [
            basicSetup,
            javascript({
              typescript: true
            })
          ]
        })
      )
      created = true
    }

    function callback() {
      if (created && editor) {
        editor.destroy()
      }
    }

    return callback
  }, [mountEl])

  return <div ref={mountEl} className="full-page" />
}

export default Editor
