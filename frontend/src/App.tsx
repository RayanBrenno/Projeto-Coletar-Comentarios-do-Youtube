import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { HomePage } from "./pages/HomePage";
import { ConsultarPage } from "./pages/ConsultarPage";
import { AtualizarPage } from "./pages/AtualizarPage";

import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<HomePage />} />
            <Route path="consultar" element={<ConsultarPage />} />
            <Route path="atualizar" element={<AtualizarPage />} />

            {/* default */}
            <Route index element={<Navigate to="home" replace />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}