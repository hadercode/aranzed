import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  Save,
  ShieldAlert,
} from "lucide-react";
import type { ChangePasswordFormData } from "../schemas/profile.schema";
import { useSecurityForm } from "../hooks/logic/useSecurityForm";
import { TextInput, Button } from "@/shared/components/ui";

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
      {/* Password Change Form */}
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
          {/* Current Password */}
          <TextInput
            label="Contraseña Actual"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña actual"
            required
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showCurrentPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />

          {/* New Password */}
          <TextInput
            label="Nueva Contraseña"
            type={showNewPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            required
            leftIcon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showNewPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />

          {/* Confirm New Password */}
          <TextInput
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repite la nueva contraseña"
            required
            leftIcon={<KeyRound size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                title={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {/* Requirements Checklist */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2">
            <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-2">
              Requisitos de seguridad para la contraseña:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                className={`flex items-center gap-2 ${
                  isMinLength
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    isMinLength ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
                <span>Mínimo 8 caracteres</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  hasUppercase
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasUppercase ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
                <span>Al menos una mayúscula</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  hasNumberOrSpecial
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    hasNumberOrSpecial ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
                <span>Un número o carácter especial</span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordsMatch
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    passwordsMatch ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
                <span>Las contraseñas coinciden</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
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

      {/* Security Advisory Card */}
      <div className="space-y-6">
        <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Políticas de Seguridad</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Por motivos de seguridad institucional, nunca compartas tus claves de acceso con terceros ni uses contraseñas previamente utilizadas en otros servicios.
          </p>
          <div className="alert-warning p-3.5 rounded-xl text-xs text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800/50">
            <p className="font-bold mb-1 text-amber-950 dark:text-amber-200">
              Cierre de Sesión:
            </p>
            <p className="text-amber-950 dark:text-amber-300 font-medium leading-relaxed">
              Al cambiar tu contraseña, tu sesión actual se mantendrá activa. En tus próximos inicios de sesión deberás ingresar tu nueva contraseña.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityTab;
