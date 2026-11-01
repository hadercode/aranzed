import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '../components/AuthCard';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth.schema';
import { useAuthMutations } from '../hooks/mutations/useAuthMutations';

export default function ResetPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { resetPasswordMutation } = useAuthMutations();

  useEffect(() => {
    if (!token) {
      setError('El token de restablecimiento es inválido o no existe.');
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    setSuccess(false);

    if (!token) {
      setError('Token de restablecimiento inválido.');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err?.message || (typeof err === 'string' ? err : 'Ocurrió un error al restablecer tu contraseña'));
    }
  };

  return (
    <AuthCard
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña"
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          Contraseña restablecida exitosamente. Redirigiendo a inicio de sesión...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Nueva Contraseña
          </label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full px-4 py-2 bg-transparent border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-[var(--color-text-primary)] text-sm"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
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
          disabled={resetPasswordMutation.isPending || !token}
          className="w-full mt-2 py-3 px-4 bg-[var(--color-sage-600)] hover:bg-[var(--color-sage-700)] text-white font-medium rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {resetPasswordMutation.isPending ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </button>
      </form>
    </AuthCard>
  );
}
