import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { languages } from 'monaco-editor';

self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		switch (label) {
			case 'json':
				return new JsonWorker();
			case 'css':
			case 'less':
			case 'scss':
				return new CssWorker();
			case 'html':
			case 'handlebars':
				return new HtmlWorker();
			case 'javascript':
			case 'typescript':
				return new TsWorker();
			default:
				return new EditorWorker();
		}
	},
};

languages.typescript.typescriptDefaults.setEagerModelSync(true);
languages.typescript.javascriptDefaults.setEagerModelSync(true);
