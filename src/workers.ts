import { languages, editor } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    switch (label) {
      case 'json':
        return new jsonWorker()
      case 'css':
      case 'less':
      case 'scss':
        return new cssWorker()
      case 'html':
      case 'razor':
      case 'handlebars':
        return new htmlWorker()
      case 'javascript':
      case 'typescript':
        return new tsWorker()
      default:
        return new editorWorker()
    }
  }
}

languages.typescript.typescriptDefaults.setEagerModelSync(true)

languages.register({
  id: 'myCustomLanguage'
})

languages.setMonarchTokensProvider('myCustomLanguage', {
  tokenizer: {
    root: [
      [/\[error.*/, 'custom-error'],
      [/\[notice.*/, 'custom-notice'],
      [/\[info.*/, 'custom-info'],
      [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
    ]
  }
})

// Define a new theme that constains only rules that match this language
editor.defineTheme('myCoolTheme', {
  colors: {},
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'custom-info', foreground: '808080' },
    { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'custom-notice', foreground: 'FFA500' },
    { token: 'custom-date', foreground: '008800' }
  ]
})
