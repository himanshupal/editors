import nodePolyfills from 'rollup-plugin-polyfill-node'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

const production = process.env.NODE_ENV === 'production'

// https://github.com/WalletConnect/web3modal#using-with-vite
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    !production &&
      nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
      })
  ],
  build: {
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      https: 'agent-base',
      http: 'agent-base',
      '@': path.resolve(__dirname, 'src')
    }
  }
})
