import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Componente principal da aplicação, configurando as rotas usando React Router, envolvendo a aplicação com o provedor de autenticação e protegendo a rota do dashboard para usuários autenticados
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Rotas públicas para login e registro, e rota protegida para o dashboard que exige autenticação. A rota raiz redireciona para o dashboard. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rota protegida para o dashboard, que só pode ser acessada por usuários autenticados. O componente ProtectedRoute verifica o estado de autenticação e redireciona para a página de login se o usuário não estiver autenticado. */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}