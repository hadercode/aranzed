import { RefreshCw, Save } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { CompanyProvider, useCompanyContext } from "../context";
import {
  CompanyPageHeader,
  CompanyBrandBanner,
  CompanyTabsNav,
  CompanyErrorBanner,
  CompanyDialogs,
  GeneralTab,
  ContactTab,
  CurrencyTab,
  BrandingTab,
  EmailTab,
  LegalTab,
} from "../components";

function CompanySettingsContent() {
  const { loading, activeTab, hasChanges, isSaving, handleSubmit } =
    useCompanyContext();

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto md:p-8">
        <div className="p-16 text-center bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-sage-500)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)] font-medium">
            Cargando configuración institucional de la empresa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header with institutional icon and top save button */}
      <CompanyPageHeader />

      {/* Error Banner */}
      <CompanyErrorBanner />

      {/* Live Brand Summary Banner */}
      <CompanyBrandBanner />

      {/* Main Tabs Workspace Card */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {/* Navigation Tabs Bar */}
        <CompanyTabsNav />

        {/* Tab Form Content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "contact" && <ContactTab />}
          {activeTab === "currency" && <CurrencyTab />}
          {activeTab === "branding" && <BrandingTab />}
          {activeTab === "email" && <EmailTab />}
          {activeTab === "legal" && <LegalTab />}

          {/* Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              loadingText="Guardando..."
              disabled={!hasChanges}
              leftIcon={<Save size={18} />}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Confirmation and Success Dialogs */}
      <CompanyDialogs />
    </div>
  );
}

export function CompanySettingsPage() {
  return (
    <CompanyProvider>
      <CompanySettingsContent />
    </CompanyProvider>
  );
}

export default CompanySettingsPage;
