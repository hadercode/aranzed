import {
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Coins,
} from "lucide-react";
import { usePurchaseFormContext } from "../../../context";
import { TextInput, Textarea, FormGroup } from "@/shared/components/ui";
import { useCurrencyStore } from "@/shared/hooks/store";

export function PurchaseHeaderSection() {
  const { form } = usePurchaseFormContext();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const currentStatus = watch("status");
  const watchedRate = watch("exchangeRate");
  const activeFunctional = watch("functionalCurrency") || functionalCurrency;
  const activeLocal = watch("localCurrency") || localCurrency;
  const documentCurrency = watch("documentCurrency") || activeFunctional;

  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
      {/* Encabezado de la sección */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Datos del Comprobante y Proveedor
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Cabecera con selección de moneda de origen de la factura (
              {activeFunctional} / {activeLocal})
            </p>
          </div>
        </div>

        {/* Badge referencial de tasa activa */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            1 {activeFunctional} ={" "}
            {Number(watchedRate || 1).toLocaleString("es-VE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            {activeLocal}
          </span>
        </div>
      </div>

      {/* Cuadrícula de campos con componentes compartidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Nombre del Proveedor */}
        <TextInput
          label="Nombre / Razón Social del Proveedor"
          required
          placeholder="Ej: Maderas y Herrajes Industriales C.A."
          leftIcon={<Building2 size={18} />}
          error={errors.supplierName?.message}
          containerClassName="lg:col-span-2"
          {...register("supplierName")}
        />

        {/* N° Factura o Documento */}
        <TextInput
          label="N° Factura / Documento"
          required
          placeholder="Ej: FAC-002941"
          leftIcon={<FileText size={18} />}
          error={errors.invoiceNumber?.message}
          className="font-mono"
          {...register("invoiceNumber")}
        />

        {/* Fecha de Emisión */}
        <TextInput
          type="date"
          label="Fecha de Emisión"
          required
          leftIcon={<Calendar size={18} />}
          error={errors.purchaseDate?.message}
          {...register("purchaseDate")}
        />

        {/* Moneda de Origen de la Factura */}
        <FormGroup label="Moneda del Documento" required>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setValue("documentCurrency", activeFunctional, {
                  shouldDirty: true,
                })
              }
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                documentCurrency === activeFunctional
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20 shadow-sm"
                  : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>
                {activeFunctional} ({functionalSymbol})
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setValue("documentCurrency", activeLocal, { shouldDirty: true })
              }
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                documentCurrency === activeLocal
                  ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold ring-2 ring-blue-500/20 shadow-sm"
                  : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>
                {activeLocal} ({localSymbol})
              </span>
            </button>
          </div>
        </FormGroup>

        {/* Tasa de Cambio */}
        <TextInput
          type="number"
          step="any"
          min="0.0001"
          label={`Tasa de Cambio (${activeLocal} / ${activeFunctional})`}
          required
          placeholder="Ej: 45.50"
          leftIcon={<TrendingUp size={18} className="text-blue-500" />}
          error={errors.exchangeRate?.message}
          className="font-mono"
          {...register("exchangeRate", { valueAsNumber: true })}
        />

        {/* Estado inicial / selector */}
        <FormGroup label="Estado de Registro" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("status", "DRAFT", { shouldDirty: true })}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                currentStatus === "DRAFT"
                  ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium ring-2 ring-amber-500/20"
                  : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
              }`}
            >
              <Clock className="w-4 h-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-semibold">Guardar Borrador</p>
                <p className="text-[10px] opacity-75">No emite stock aún</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setValue("status", "COMPLETED", { shouldDirty: true })
              }
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                currentStatus === "COMPLETED"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium ring-2 ring-emerald-500/20"
                  : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <div>
                <p className="text-xs font-semibold">Completada (Stock OK)</p>
                <p className="text-[10px] opacity-75">
                  Emite evento a inventario
                </p>
              </div>
            </button>
          </div>
        </FormGroup>

        {/* Descripción u Observaciones */}
        <Textarea
          label="Notas / Descripción General (Opcional)"
          rows={2}
          placeholder="Observaciones de recepción, transportista o condiciones de pago..."
          containerClassName="lg:col-span-4"
          {...register("description")}
        />
      </div>
    </div>
  );
}

export default PurchaseHeaderSection;
