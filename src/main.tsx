import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import '@/styles/main.scss'

import Monaco from '@/pages/Monaco'

const rootEl = document.getElementById('root')!

createRoot(rootEl).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Monaco />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
