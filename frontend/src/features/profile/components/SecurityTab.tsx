import { Lock, Eye, EyeOff, KeyRound, Save } from 'lucide-react';
import type { ChangePasswordFormData } from '../schemas/profile.schema';
import { useSecurityForm } from '../hooks/logic/useSecurityForm';
import { TextInput, Button } from '@/shared/components/ui';
import { PasswordRequirementsList } from './PasswordRequirementsList';
import { SecurityAdvisorySidebar } from './SecurityAdvisorySidebar';

interface SecurityTabProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  isMutating: boolean;
}

export function SecurityTab({ onSubmit, isMutating }: SecurityTabProps) {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    isMinLength,
    hasUppercase,
    hasNumberOrSpecial,
    passwordsMatch,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useSecurityForm({ onSubmit });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      <div className="lg:col-span-2 bg-[var(--color-surface-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Cambiar Contraseña
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Asegura tu cuenta actualizando tu contraseña periódicamente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Contraseña Actual"
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Ingresa tu contraseña actual"
            required
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showCurrentPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
          />

          <TextInput
            label="Nueva Contraseña"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Crea una contraseña segura"
            required
            leftIcon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showNewPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />

          <TextInput
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repite la nueva contraseña"
            required
            leftIcon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <PasswordRequirementsList
            isMinLength={isMinLength}
            hasUppercase={hasUppercase}
            hasNumberOrSpecial={hasNumberOrSpecial}
            passwordsMatch={passwordsMatch}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isMutating}
              disabled={isMutating || !isValid}
              leftIcon={<Save size={18} />}
            >
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>

      <SecurityAdvisorySidebar />
    </div>
  );
}

export default SecurityTab;
