import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { APP_ROUTES } from './constants/routes'
import './App.css'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.REGISTER} element={<Register />} />
          <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={APP_ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route 
            path={APP_ROUTES.DASHBOARD} 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
