import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useState, useEffect, useRef } from 'react'
import { getCode } from '@/utils/getLogs'

const Editor = () => {
  let created = false
  const monacoEl = useRef<HTMLDivElement>(null)
  const [editorEl, setEditorEl] = useState<editor.IStandaloneCodeEditor>()

  useEffect(() => {
    if (!created && !editorEl && monacoEl) {
      setEditorEl(
        editor.create(monacoEl.current!, {
          // value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          // language: 'typescript',
          value: getCode(),
          theme: 'myCoolTheme',
          language: 'myCustomLanguage'
        })
      )
      created = true
    }

    function callback() {
      if (created && editorEl) {
        editorEl.dispose()
        created = false
      }
    }

    return callback
  }, [monacoEl.current])

  return <div ref={monacoEl} className="full-page" />
}

export default Editor
