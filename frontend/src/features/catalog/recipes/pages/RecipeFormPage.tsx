import { useParams } from 'react-router-dom';
import { RecipeFormProvider, useRecipeFormContext } from '../context';
import {
  RecipeFormHeader,
  RecipeHeaderSection,
  RecipeSyncCostSection,
  RecipeCostSummarySection,
  RecipeItemsSection,
  RecipeFormStickyBar,
  RecipeFormFeedback,
  RecipeFormLoadingState,
  RecipeFormErrorState,
} from '../components';

function RecipeFormPageContent() {
  const { loadingInitial, loadError, handleSave } = useRecipeFormContext();

  if (loadingInitial) {
    return <RecipeFormLoadingState />;
  }

  if (loadError) {
    return <RecipeFormErrorState />;
  }

  return (
    <form
      id="recipe-form-page"
      onSubmit={handleSave}
      noValidate
      className="max-w-7xl mx-auto pb-28 animate-in fade-in duration-300 space-y-6"
    >
      {/* Top Header & Actions */}
      <RecipeFormHeader />

      {/* 1. Datos Básicos y Producto a Fabricar */}
      <RecipeHeaderSection />

      {/* 2. Sincronización Automática de Costos */}
      <RecipeSyncCostSection />

      {/* 3. Desglose de Costos de Fabricación (Todo el ancho) */}
      <RecipeCostSummarySection />

      {/* 4. Listado de Componentes, Insumos y Mano de Obra (Todo el ancho) */}
      <RecipeItemsSection />

      {/* Floating Bottom Sticky Action Bar */}
      <RecipeFormStickyBar />

      {/* Feedback Dialogs and Notifications */}
      <RecipeFormFeedback />
    </form>
  );
}

export function RecipeFormPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <RecipeFormProvider recipeId={id}>
      <RecipeFormPageContent />
    </RecipeFormProvider>
  );
}

export default RecipeFormPage;
