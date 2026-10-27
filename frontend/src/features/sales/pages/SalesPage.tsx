import { SalesProvider } from '../context';
import {
  SalesPageHeader,
  SalesStatsCards,
  SalesFilterBar,
  SalesTable,
  SalesDialogs,
} from '../components';

function SalesPageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <SalesPageHeader />
      <SalesStatsCards />
      <SalesFilterBar />
      <SalesTable />
      <SalesDialogs />
    </div>
  );
}

export function SalesPage() {
  return (
    <SalesProvider>
      <SalesPageContent />
    </SalesProvider>
  );
}

export default SalesPage;
