import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, UserRound } from 'lucide-react';
import { CompleteProfileForm, ProfileData } from './CompleteProfileForm';

const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState<RegisterFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegistration = async (data: RegisterFormValues) => {
    setUserData(data);
  };

  const handleProfileComplete = async (profileData: ProfileData) => {
    if (!userData) return;

    try {
      // Aqui você faria a chamada para a API com todos os dados
      const completeData = {
        ...userData,
        ...profileData,
      };
      
      console.log('Dados completos do registro:', completeData);
      // Após o registro bem-sucedido
      onSuccess();
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  if (userData) {
    return (
      <CompleteProfileForm
  baseData={userData}
  onComplete={async (profileData) => {
    try {
      // Junta os dados básicos com os dados complementares
      const payload = {
        ...userData,
        ...profileData, // aqui está o document, phone, address
      };

      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido');
      }

      const result = await response.json();

      alert('Cadastro completo com sucesso!');
      console.log('Tokens recebidos:', result);

    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao finalizar o cadastro.');
    }
  }}
/>

    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            {...register('name')}
            className={`pl-10 w-full rounded-lg border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="João Silva"
          />
        </div>
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            {...register('email')}
            className={`pl-10 w-full rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="email@exemplo.com"
          />
        </div>
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`pl-10 w-full rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`pl-10 w-full rounded-lg border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-indigo-600 text-white p-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Processando...' : 'Continuar'}
      </button>
    </form>
  );
};