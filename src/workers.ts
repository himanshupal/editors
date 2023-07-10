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
			case 'abi':
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
languages.json.jsonDefaults.setDiagnosticsOptions({
	allowComments: true,
	validate: true,
	schemas: [
		{
			uri: 'http://myserver/foo-schema.json', // id of the first schema
			fileMatch: ['*.json'], // associate with our model
			schema: {
				type: 'object',
				properties: {
					p1: {
						enum: ['v1', 'v2'],
						markdownDescription: 'This is an enum',
					},
					p2: {
						$ref: 'http://myserver/bar-schema.json', // reference the second schema
					},
				},
			},
		},
		{
			uri: 'http://myserver/bar-schema.json', // id of the second schema
			schema: {
				type: 'object',
				properties: {
					q1: {
						enum: ['x1', 'x2'],
					},
				},
			},
		},
	],
});
