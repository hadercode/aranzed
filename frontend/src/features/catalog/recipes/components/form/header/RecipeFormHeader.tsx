import { ScrollText } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui';
import { RecipeTourLauncher } from '../../tour';

export interface RecipeFormHeaderProps {
  isEditing?: boolean;
  onCancel?: () => void;
  isMutating?: boolean;
}

export function RecipeFormHeader({
  isEditing = false,
  onCancel,
  isMutating = false,
}: RecipeFormHeaderProps) {
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
      onCancel={onCancel}
      cancelDisabled={isMutating}
      submitText={isEditing ? 'Guardar Cambios' : 'Crear Receta'}
      isSubmitting={isMutating}
      submitFormId="recipe-form-page"
      actions={
        <div className="flex items-center gap-2">
          <RecipeTourLauncher variant="button" />
        </div>
      }
    />
  );
}

export default RecipeFormHeader;
