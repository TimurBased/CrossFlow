import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppRoutes } from './routes/index.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppRoutes />
	</StrictMode>
)
