import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const { state, login, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const isFuncionario = location.pathname === '/funcionario';

  const handleBlur = (field: string) => {
    setTouchedFields({ ...touchedFields, [field]: true });
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isEmailInvalid = touchedFields.email && email && !validateEmail(email);
  const isPasswordInvalid = touchedFields.password && (!password || password.length < 6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouchedFields({ email: true, password: true });

    if (!validateEmail(email) || !password || password.length < 6) return;

    const success = await login({ email, password });
    if (success) navigate(isFuncionario ? '/dashboard' : '/cliente');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {state.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          </div>
        )}

        {/* E-mail */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state.error) clearError();
            }}
            onBlur={() => handleBlur('email')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              isEmailInvalid ? 'border-red-300' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {isEmailInvalid && (
            <p className="text-red-600 text-sm mt-1">Por favor, insira um e-mail válido.</p>
          )}
        </div>

        {/* Senha */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (state.error) clearError();
            }}
            onBlur={() => handleBlur('password')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              isPasswordInvalid ? 'border-red-300' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {isPasswordInvalid && (
            <p className="text-red-600 text-sm mt-1">A senha deve ter pelo menos 6 caracteres.</p>
          )}
        </div>

        {/* Lembrar-me + esqueci a senha */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            Lembrar-me
          </label>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Esqueceu a senha?
          </a>
        </div>

        {/* Botão de login */}
        <div>
          <button
            type="submit"
            disabled={state.isLoading}
            className={`w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              state.isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {state.isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
