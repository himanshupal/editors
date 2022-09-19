import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import '@/main.css'

import CodeMirror from '@/pages/CodeMirror'
import Monaco from '@/pages/Monaco'

const rootEl = document.getElementById('root')!

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/monaco" element={<Monaco />} />
        <Route path="/codemirror" element={<CodeMirror />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
