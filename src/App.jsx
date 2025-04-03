import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import UserDetailPage from './pages/UserDetailPage'
import OffersPage from './pages/OffersPage'
import EducationalOffersPage from './pages/EducationalOffersPage'
import PostsPage from './pages/PostsPage'
import SchoolsPage from './pages/SchoolsPage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/common/Layout'

function App() {
  const { isAuthenticated, loading } = useAuth()

  // Proteger rutas que requieren autenticación
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading">Cargando...</div>
    if (!isAuthenticated) return <Navigate to="/login" />
    return children
  }

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="usuarios/:userId" element={<UserDetailPage />} />
          <Route path="ofertas" element={<OffersPage />} />
          <Route path="ofertas-educativas" element={<EducationalOffersPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="escuelas" element={<SchoolsPage />} />
        </Route>
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
