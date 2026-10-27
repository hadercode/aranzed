import { Building2, Mail, Phone, Coins } from 'lucide-react';
import { useCompanyContext } from '../../context';

export function CompanyBrandBanner() {
  const { formData, previewLogo, sampleFormattedPrice } = useCompanyContext();

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-pink-500/10 border border-pink-500/20 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#22B2B8] before:via-[#8B5CF6] before:via-[#F43F5E] before:via-[#F97316] before:to-[#F59E0B]">
      <div className="relative group shrink-0">
        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-pink-500/30 bg-[var(--color-surface-card)] flex items-center justify-center overflow-hidden shadow-inner">
          {previewLogo ? (
            <img src={previewLogo} alt="Logo" className="w-full h-full object-contain p-2" />
          ) : (
            <Building2 className="w-10 h-10 text-[#F43F5E]" />
          )}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-1">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {formData.legalName || 'Nombre de la Empresa'}
          </h2>
          {formData.identificationNumber && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/15 text-[#F43F5E] dark:text-[#FB7185] border border-pink-500/20">
              ID: {formData.identificationNumber}
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] italic">
          {formData.slogan || 'Sin lema configurado'}
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-[var(--color-text-secondary)]">
          {formData.email && (
            <span className="flex items-center gap-1">
              <Mail size={13} className="text-[#22B2B8]" /> {formData.email}
            </span>
          )}
          {formData.phone && (
            <span className="flex items-center gap-1">
              <Phone size={13} className="text-[#F43F5E]" /> {formData.phone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Coins size={13} className="text-[#F59E0B]" /> Moneda:{' '}
            {formData.currencyCode || 'USD'} ({sampleFormattedPrice})
          </span>
        </div>
      </div>
    </div>
  );
}

export default CompanyBrandBanner;
