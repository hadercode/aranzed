import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/shared/hooks/store/useAuthStore';
import { AuthCard } from '../components/AuthCard';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { useAuthMutations } from '../hooks/mutations/useAuthMutations';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { loginMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const res = await loginMutation.mutateAsync(data);
      setAuth(res.user, res.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || (typeof err === 'string' ? err : 'Ocurrió un error al iniciar sesión'));
    }
  };

  return (
    <AuthCard
      title="Bienvenido a Aranzed"
      subtitle="Ingresa tus credenciales para continuar"
      footer={
        <p>
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
          >
            Regístrate
          </Link>
        </p>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="admin@nexus.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-primary)]">
              Contraseña
            </label>
            <Link
              to="/recover-password"
              className="text-xs text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2.5 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)]"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 px-4 bg-[var(--color-sage-600)] hover:bg-[var(--color-sage-700)] text-white font-medium rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </AuthCard>
  );
}
