import nodePolyfills from 'rollup-plugin-polyfill-node';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';
import path from 'path';

const production = process.env.NODE_ENV === 'production';
const basePath = path.resolve(__dirname, 'src');

// https://github.com/WalletConnect/web3modal#using-with-vite
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svgr(),
		react(),
		!production &&
			nodePolyfills({
				include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
			}),
	],
	build: {
		chunkSizeWarningLimit: 3584,
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills(),
			],
			output: {
				manualChunks: {
					editor: ['monaco-editor'],
				},
			},
		},
		// ↓ Needed for build if using WalletConnect and other providers
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	resolve: {
		alias: {
			process: 'process/browser',
			stream: 'stream-browserify',
			https: 'agent-base',
			http: 'agent-base',
			'@': basePath,
		},
	},
	css: {
		preprocessorOptions: {
			scss: { additionalData: `@import "${basePath}/styles/variables.scss";\n` },
		},
	},
});
