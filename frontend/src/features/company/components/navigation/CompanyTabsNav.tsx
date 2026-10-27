import {
  Building2,
  MapPin,
  Coins,
  ImageIcon,
  Mail,
  FileText,
} from 'lucide-react';
import { CompanyTabButton } from './CompanyTabButton';

export function CompanyTabsNav() {
  return (
    <div className="flex border-b border-[var(--color-border)] overflow-x-auto no-scrollbar">
      <CompanyTabButton
        tab="general"
        icon={<Building2 size={17} />}
        label="General & Identificación"
      />
      <CompanyTabButton
        tab="contact"
        icon={<MapPin size={17} />}
        label="Contacto & Dirección"
      />
      <CompanyTabButton
        tab="currency"
        icon={<Coins size={17} />}
        label="Moneda & Región"
      />
      <CompanyTabButton
        tab="branding"
        icon={<ImageIcon size={17} />}
        label="Logotipo & Marca"
      />
      <CompanyTabButton
        tab="email"
        icon={<Mail size={17} />}
        label="Configuración de Correo"
      />
      <CompanyTabButton
        tab="legal"
        icon={<FileText size={17} />}
        label="Legal & Facturación"
      />
    </div>
  );
}

export default CompanyTabsNav;
