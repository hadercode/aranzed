import { Mail, Calendar } from "lucide-react";
import type { UserProfile } from "../hooks/queries/useProfileQuery";

export interface ProfileHeaderMetaProps {
  profile: UserProfile | null;
  formData?: Partial<UserProfile>;
  fullName: string;
  formattedJoinDate: string;
}

export function ProfileHeaderMeta({
  profile,
  formData,
  fullName,
  formattedJoinDate,
}: ProfileHeaderMetaProps) {
  return (
    <div className="flex-1 text-center sm:text-left space-y-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          {fullName}
        </h1>
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
          {(profile?.roles || ["USER_ROLE"]).map((role: string) => (
            <span
              key={role}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-sage-50)] text-[var(--color-sage-600)] border border-[var(--color-sage-500)]/20"
            >
              {role === "ADMIN_ROLE"
                ? "Administrador"
                : role.replace("_ROLE", "")}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Activo
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {formData?.jobTitle || profile?.jobTitle || "Miembro del equipo"}
      </p>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <Mail className="w-3.5 h-3.5" />
          {profile?.email || "cargando..."}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Miembro desde {formattedJoinDate}
        </span>
      </div>
    </div>
  );
}

export default ProfileHeaderMeta;
