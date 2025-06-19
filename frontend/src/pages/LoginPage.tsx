import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, tokenExpiresAt } = useAuth(); // Espera receber timestamp em ms
  const navigate = useNavigate();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');

      if (tokenExpiresAt) {
        const now = Date.now();
        const msLeft = tokenExpiresAt - now;
        if (msLeft > 0) {
          const minutesLeft = Math.floor(msLeft / 60000);
          const secondsLeft = Math.floor((msLeft % 60000) / 1000);
          alert(`Seu token expira em ${minutesLeft} minuto(s) e ${secondsLeft} segundo(s).`);
        }
      }
    }
  }, [isAuthenticated, navigate, tokenExpiresAt]);

  const switchView = (toLogin) => {
    setAnimationClass(toLogin ? 'slide-right' : 'slide-left');
    setTimeout(() => {
      setIsLogin(toLogin);
      setAnimationClass('');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-100 p-4">
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row`}>
        {/* Painel Esquerdo */}
        <div
          className={`bg-gradient-to-br from-rose-500 to-amber-400 text-white p-8 md:w-5/12 flex flex-col justify-center items-center text-center transform transition-transform duration-500 ${animationClass}`}
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto text-3xl">
              🍷
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Novo por aqui?' : 'Bem-vindo de volta!'}
          </h2>
          <p className="text-white/80 mb-8 max-w-xs">
            {isLogin
              ? 'Cadastre-se no Seraphine Connect, a solução inteligente de autoatendimento para bares e restaurantes.'
              : 'Acesse sua conta no Seraphine Connect e continue oferecendo experiências incríveis aos seus clientes.'}
          </p>
          <button
            onClick={() => switchView(!isLogin)}
            className="px-8 py-2.5 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            {isLogin ? 'Criar conta' : 'Entrar'}
          </button>
        </div>

        {/* Formulário */}
        <div className={`p-8 md:w-7/12 transform transition-transform duration-500 ${animationClass}`}>
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
            </h1>
            <p className="text-gray-600 mb-8">
              {isLogin
                ? 'Digite suas credenciais para entrar no Seraphine Connect'
                : 'Preencha os dados para começar a usar o Seraphine Connect'}
            </p>

            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm onSuccess={() => switchView(true)} />
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}
                <button
                  onClick={() => switchView(!isLogin)}
                  className="text-rose-600 font-medium hover:underline"
                >
                  {isLogin ? 'Cadastre-se' : 'Entrar'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
