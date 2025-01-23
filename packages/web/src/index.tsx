import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoutes } from './routes/index.tsx'
import { Provider } from 'react-redux'
import { setupStore } from './store/store'

createRoot(document.getElementById('root')!).render(
	<Provider store={setupStore()}>
		<StrictMode>
			<AppRoutes />
		</StrictMode>
	</Provider>
)
