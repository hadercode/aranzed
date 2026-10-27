import { ScrollText } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui';
import { useRecipeFormContext } from '../../../context';

export function RecipeFormHeader() {
  const { isEditing, handleCancel, isMutating } = useRecipeFormContext();

  return (
    <FormHeader
      breadcrumbs={[
        { label: 'Catálogo', to: '/catalog/recipes' },
        { label: 'Recetas / BOM', to: '/catalog/recipes' },
        { label: isEditing ? 'Editar Receta' : 'Nueva Receta' },
      ]}
      icon={<ScrollText className="w-5 h-5" />}
      title={isEditing ? 'Editar Receta / BOM' : 'Nueva Receta de Fabricación (BOM)'}
      description="Define los componentes de materia prima, servicios de mano de obra y rendimientos"
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitText={isEditing ? 'Guardar Cambios' : 'Crear Receta'}
      isSubmitting={isMutating}
      submitFormId="recipe-form-page"
    />
  );
}

export default RecipeFormHeader;
