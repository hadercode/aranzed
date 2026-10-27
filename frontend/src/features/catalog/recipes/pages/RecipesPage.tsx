import { RecipesProvider } from '../context';
import {
  RecipesPageHeader,
  RecipesStatsCards,
  RecipesFilterBar,
  RecipesTable,
  RecipesDialogs,
} from '../components';

function RecipesPageContent() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      <RecipesPageHeader />
      <RecipesStatsCards />
      <RecipesFilterBar />
      <RecipesTable />
      <RecipesDialogs />
    </div>
  );
}

export function RecipesPage() {
  return (
    <RecipesProvider>
      <RecipesPageContent />
    </RecipesProvider>
  );
}

export default RecipesPage;
