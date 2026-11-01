import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipeTour } from "../hooks";
import { useRecipeFormPage } from "../hooks/logic/useRecipeFormPage";
import { useRecipeTourStore } from "../store";
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
  RecipeTourIntroModal,
} from "../components";

export function RecipeFormPage() {
  const { id } = useParams<{ id: string }>();
  const formPage = useRecipeFormPage(id);
  const {
    loadingInitial,
    loadError,
    refetchInitial,
    handleSave,
    isEditing,
    handleCancel,
    isMutating,
  } = formPage;
  const { startInteractiveTour } = useRecipeTour();
  const { shouldAutoStartTour, setShouldAutoStartTour } = useRecipeTourStore();

  useEffect(() => {
    if (!loadingInitial && !loadError && shouldAutoStartTour) {
      setShouldAutoStartTour(false);
      const timer = setTimeout(() => {
        startInteractiveTour();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [
    loadingInitial,
    loadError,
    shouldAutoStartTour,
    setShouldAutoStartTour,
    startInteractiveTour,
  ]);

  if (loadingInitial) {
    return <RecipeFormLoadingState />;
  }

  if (loadError) {
    return (
      <RecipeFormErrorState
        loadError={loadError}
        refetchInitial={refetchInitial}
        handleCancel={handleCancel}
      />
    );
  }

  return (
    <>
      <form
        id="recipe-form-page"
        onSubmit={handleSave}
        noValidate
        className="max-w-8xl mx-auto pb-28 animate-in fade-in duration-300 space-y-6"
      >
        {/* Top Header & Actions */}
        <RecipeFormHeader
          isEditing={isEditing}
          onCancel={handleCancel}
          isMutating={isMutating}
        />

        {/* 1. Datos Básicos y Producto a Fabricar */}
        <div id="tour-recipe-header">
          <RecipeHeaderSection formPage={formPage} />
        </div>

        {/* 2. Sincronización Automática de Costos */}
        <div id="tour-recipe-sync-cost">
          <RecipeSyncCostSection formPage={formPage} />
        </div>

        {/* 3. Desglose de Costos de Fabricación (Todo el ancho) */}
        <div id="tour-recipe-cost-summary">
          <RecipeCostSummarySection formPage={formPage} />
        </div>

        {/* 4. Listado de Componentes, Insumos y Mano de Obra (Todo el ancho) */}
        <div id="tour-recipe-items">
          <RecipeItemsSection formPage={formPage} />
        </div>

        {/* Floating Bottom Sticky Action Bar */}
        <div id="tour-recipe-sticky-bar">
          <RecipeFormStickyBar formPage={formPage} />
        </div>

        {/* Feedback Dialogs and Notifications */}
        <RecipeFormFeedback formPage={formPage} />
      </form>
      <RecipeTourIntroModal />
    </>
  );
}

export default RecipeFormPage;
