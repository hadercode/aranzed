import {
  User,
  Mail,
  Phone,
  Briefcase,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { UserProfile } from "../hooks/queries/useProfileQuery";
import type { PersonalInfoFormData } from "../schemas/profile.schema";
import { usePersonalForm } from "../hooks/logic/usePersonalForm";
import { TextInput, Textarea, Button } from "@/shared/components/ui";

interface PersonalTabProps {
  profile: UserProfile | null;
  onSubmit: (data: PersonalInfoFormData) => Promise<void>;
  isMutating: boolean;
}

export function PersonalTab({
  profile,
  onSubmit,
  isMutating,
}: PersonalTabProps) {
  const { register, handleSubmit, errors, isDirty } = usePersonalForm({
    profile,
    onSubmit,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Form Section */}
      <div className="lg:col-span-2 bg-[var(--color-surface-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Información Personal
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Actualiza tus datos de contacto y detalles profesionales para tu
            cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              leftIcon={<User size={18} />}
              {...register("firstName")}
              error={errors.firstName?.message}
            />

            {/* Last Name */}
            <TextInput
              label="Apellidos"
              placeholder="Tus apellidos"
              leftIcon={<User size={18} />}
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email (Readonly) */}
            <TextInput
              label="Correo Electrónico"
              type="email"
              disabled
              value={profile?.email || ""}
              leftIcon={<Mail size={18} />}
              helperText="Para cambiar el correo, contacta al administrador del sistema."
            />

            {/* Phone */}
            <TextInput
              label="Teléfono / WhatsApp"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone size={18} />}
              {...register("phone")}
              error={errors.phone?.message}
            />
          </div>

          {/* Job Title */}
          <TextInput
            label="Cargo / Puesto de Trabajo"
            placeholder="Ej. Gerente de Operaciones, Desarrollador Senior..."
            leftIcon={<Briefcase size={18} />}
            {...register("jobTitle")}
            error={errors.jobTitle?.message}
          />

          {/* Bio */}
          <Textarea
            label="Biografía / Resumen Profesional"
            placeholder="Escribe unas breves palabras sobre tu experiencia, especialidades o responsabilidades..."
            rows={4}
            {...register("bio")}
            error={errors.bio?.message}
          />

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isMutating}
              disabled={isMutating || !isDirty}
              leftIcon={<Save size={18} />}
            >
              Guardar Información
            </Button>
          </div>
        </form>
      </div>

      {/* Information Cards / Sidebar */}
      <div className="space-y-6">
        <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-sage-500)]" />
            <span>Visibilidad de la Cuenta</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Tus datos personales y foto de perfil son visibles para otros
            miembros del equipo en la plataforma Nexus.
          </p>
          <div className="p-3.5 rounded-xl bg-[var(--color-sage-50)] text-xs text-[var(--color-sage-600)] border border-[var(--color-sage-500)]/20">
            <p className="font-semibold mb-1">Roles Asignados:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
              {(profile?.roles || []).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Consejo de Perfil</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Mantener tu número de teléfono y cargo actualizados permite a tus
            compañeros comunicarse de manera más efectiva para autorizaciones y
            operaciones en el sistema.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonalTab;
