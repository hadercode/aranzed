import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '../components/AuthCard';
import { recoverPasswordSchema, type RecoverPasswordFormData } from '../schemas/auth.schema';
import { useAuthMutations } from '../hooks/mutations/useAuthMutations';

export default function RecoverPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { recoverPasswordMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
  });

  const onSubmit = async (data: RecoverPasswordFormData) => {
    setError('');
    setSuccess(false);
    try {
      await recoverPasswordMutation.mutateAsync(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || (typeof err === 'string' ? err : 'Ocurrió un error al procesar tu solicitud'));
    }
  };

  return (
    <AuthCard
      title="Recuperar Contraseña"
      subtitle="Ingresa tu correo y te enviaremos instrucciones"
      footer={
        <Link
          to="/login"
          className="text-sm text-[var(--color-sage-600)] hover:text-[var(--color-sage-500)] font-medium"
        >
          &larr; Volver a Iniciar Sesión
        </Link>
      }
    >
      {error && (
        <div className="alert-danger mb-6 p-4 rounded-xl text-red-950 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900/60 shadow-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success mb-6 p-4 rounded-xl text-emerald-950 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
          Si el correo existe, hemos enviado un enlace para restablecer tu contraseña.
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

        <button
          type="submit"
          disabled={recoverPasswordMutation.isPending}
          className="w-full py-3 px-4 bg-[var(--color-sage-600)] hover:bg-[var(--color-sage-700)] text-white font-medium rounded-xl shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {recoverPasswordMutation.isPending ? 'Enviando instrucciones...' : 'Enviar Instrucciones'}
        </button>
      </form>
    </AuthCard>
  );
}
