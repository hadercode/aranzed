import { Sparkles } from "lucide-react";

export function ProfileCover() {
  return (
    <div className="h-36 sm:h-44 bg-gradient-to-r from-[var(--color-sage-600)] via-[var(--color-sage-500)] to-[#4B6B56] relative">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/90 text-xs font-medium border border-white/20">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Perfil Personal</span>
      </div>
    </div>
  );
}

export default ProfileCover;
