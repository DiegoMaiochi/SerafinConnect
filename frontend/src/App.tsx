import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

import LoginPage from "./pages/LoginPage";
import FuncionarioLoginPage from "./pages/FuncionarioLoginPage";
import ClientePage from "./pages/ClientePage";

import { SideBar } from "./NovasTelas/SideBar";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Telas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/funcionario" element={<FuncionarioLoginPage />} />
<Route
  path="/cliente"
  element={
    <PrivateRoute>
      <ClientePage />
    </PrivateRoute>
  }
/>

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <SideBar />
              </PrivateRoute>
            }
          />

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
