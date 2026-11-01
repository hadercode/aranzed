import { useReasonsQuery as useQueryHook } from './queries/useReasonsQuery';
import { useReasonMutations } from './mutations/useReasonMutations';

export * from './queries/useReasonsQuery';
export * from './mutations/useReasonMutations';

export function useReasonsQuery() {
  const query = useQueryHook();
  const mutations = useReasonMutations();

  return {
    ...query,
    ...mutations,
  };
}
