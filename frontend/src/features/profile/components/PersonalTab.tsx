import { User, Mail, Phone, Briefcase, Save } from 'lucide-react';
import type { UserProfile } from '../hooks/queries/useProfileQuery';
import type { PersonalInfoFormData } from '../schemas/profile.schema';
import { usePersonalForm } from '../hooks/logic/usePersonalForm';
import { TextInput, Textarea, Button } from '@/shared/components/ui';
import { PersonalTipsSidebar } from './PersonalTipsSidebar';

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
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              leftIcon={<User size={18} />}
              {...register('firstName')}
              error={errors.firstName?.message}
            />

            <TextInput
              label="Apellidos"
              placeholder="Tus apellidos"
              leftIcon={<User size={18} />}
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <TextInput
            label="Correo Electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            disabled
            value={profile?.email || ''}
            leftIcon={<Mail size={18} />}
            helperText="El correo no puede modificarse directamente por motivos de seguridad."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Teléfono"
              placeholder="+58 412 1234567"
              leftIcon={<Phone size={18} />}
              {...register('phone')}
              error={errors.phone?.message}
            />

            <TextInput
              label="Cargo / Título Profesional"
              placeholder="Ej. Administrador"
              leftIcon={<Briefcase size={18} />}
              {...register('jobTitle')}
              error={errors.jobTitle?.message}
            />
          </div>

          <Textarea
            label="Biografía / Notas"
            placeholder="Una breve descripción sobre tus funciones o perfil..."
            rows={3}
            {...register('bio')}
            error={errors.bio?.message}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isMutating}
              disabled={isMutating || !isDirty}
              leftIcon={<Save size={18} />}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      <PersonalTipsSidebar profile={profile} />
    </div>
  );
}

export default PersonalTab;
