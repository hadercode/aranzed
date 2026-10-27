import type { ReactNode } from 'react';
import type { CompanyTab } from '../../hooks/logic/useCompanyPage';
import { useCompanyContext } from '../../context';

interface CompanyTabButtonProps {
  tab: CompanyTab;
  icon: ReactNode;
  label: string;
}

export function CompanyTabButton({ tab, icon, label }: CompanyTabButtonProps) {
  const { activeTab, setActiveTab } = useCompanyContext();
  const active = activeTab === tab;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 flex items-center gap-2.5 transition-all cursor-pointer ${
        active
          ? 'border-[#F43F5E] text-[#F43F5E] dark:text-[#FB7185] bg-pink-500/5 font-semibold'
          : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-gray-200'
      }`}
    >
      <span className={active ? 'text-[#F43F5E] dark:text-[#FB7185]' : 'text-gray-400'}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default CompanyTabButton;
