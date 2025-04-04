import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { setupStore } from './store/store.ts'
import { AppRoutes } from './routes/routes.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={setupStore()}>
    <StrictMode>
      <AppRoutes />
    </StrictMode>
  </Provider>
)
