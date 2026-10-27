import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-surface-bg)]">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] rounded-3xl p-8 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] flex items-center justify-center mb-4 shadow-md shadow-cyan-500/25">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {subtitle}
          </p>
        </div>

        {children}

        {footer && <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">{footer}</div>}
      </div>
    </div>
  );
}
