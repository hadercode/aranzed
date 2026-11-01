import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '../components/AuthCard';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';
import { useAuthMutations } from '../hooks/mutations/useAuthMutations';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { registerMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setSuccess(false);
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || (typeof err === 'string' ? err : 'Ocurrió un error al registrar el usuario'));
    }
  };

  return (
    <AuthCard
      title="Crear Cuenta"
      subtitle="Únete a Aranzed para comenzar"
      footer={
        <p>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
          >
            Iniciar Sesión
          </Link>
        </p>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          Usuario registrado exitosamente. Redirigiendo a inicio de sesión...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)] text-sm"
            placeholder="admin@nexus.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Contraseña
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)] text-sm"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-2 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)] text-sm"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-2 py-3 px-4 bg-[var(--color-sage-600)] hover:bg-[var(--color-sage-700)] text-white font-medium rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>
    </AuthCard>
  );
}
