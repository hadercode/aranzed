import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus } from "lucide-react";
import { PageHeader, Button } from "@/shared/components/ui";
import {
  PurchasesStatsCards,
  PurchasesFilterBar,
  PurchasesTable,
  PurchasesDialogs,
} from "../components";

export function PurchasesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Compras de Materiales"
        description="Registro y control de compras de materias primas e insumos. Emite eventos desacoplados para actualización de stock."
        icon={<ShoppingCart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
      >
        <Button
          variant="primary"
          onClick={() => navigate('/purchases/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Registrar Compra
        </Button>
      </PageHeader>

      <PurchasesStatsCards />
      <PurchasesFilterBar />
      <PurchasesTable />
      <PurchasesDialogs />
    </div>
  );
}

export default PurchasesPage;
