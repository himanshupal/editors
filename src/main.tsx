import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EditorStateProvider from '@/context/EditorContext'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import '@/styles/main.scss'
import '@/themes/editor'
import '@/languages'
import '@/workers'

import Home from '@/pages/Home'

const rootEl = document.getElementById('root')!

createRoot(rootEl).render(
	<StrictMode>
		<EditorStateProvider>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
				</Routes>
			</BrowserRouter>
		</EditorStateProvider>
	</StrictMode>
)
