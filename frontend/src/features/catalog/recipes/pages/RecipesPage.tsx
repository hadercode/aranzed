import {
  RecipesPageHeader,
  RecipesStatsCards,
  RecipesFilterBar,
  RecipesTable,
  RecipesDialogs,
  RecipeTourIntroModal,
} from '../components';

export function RecipesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      <RecipesPageHeader />
      <RecipesStatsCards />
      <RecipesFilterBar />
      <RecipesTable />
      <RecipesDialogs />
      <RecipeTourIntroModal />
    </div>
  );
}

export default RecipesPage;
