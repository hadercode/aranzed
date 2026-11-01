import { useWarehousesQuery as useQueryHook } from './queries/useWarehousesQuery';
import { useWarehouseMutations } from './mutations/useWarehouseMutations';

export * from './queries/useWarehousesQuery';
export * from './mutations/useWarehouseMutations';

export function useWarehousesQuery() {
  const query = useQueryHook();
  const mutations = useWarehouseMutations();

  return {
    ...query,
    ...mutations,
  };
}
