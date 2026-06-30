import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useUser } from './lib/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import SessionDetail from './pages/SessionDetail'
import TrainingMode from './pages/TrainingMode'
import History from './pages/History'

function RequireAuth({ children }) {
  const user = useUser()
  if (user === undefined) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const user = useUser()
  if (user === undefined) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/builder" element={<RequireAuth><Builder /></RequireAuth>} />
      <Route path="/builder/:id" element={<RequireAuth><Builder /></RequireAuth>} />
      <Route path="/session/:id" element={<RequireAuth><SessionDetail /></RequireAuth>} />
      <Route path="/train/:id" element={<RequireAuth><TrainingMode /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
