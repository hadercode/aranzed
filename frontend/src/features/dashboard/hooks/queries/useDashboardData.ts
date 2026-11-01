import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';
import type { DashboardSummaryResponse } from '../../types';
import {
  transformMetrics,
  transformActivities,
  transformTeamUpdates,
} from './dashboard.transformers';

export function useDashboardData() {
  const { data, isLoading, isFetching, error, refetch } = useQuery<DashboardSummaryResponse>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const metrics = useMemo(() => transformMetrics(data, isLoading), [data, isLoading]);
  const recentLogs = useMemo(() => transformActivities(data), [data]);
  const teamUpdates = useMemo(() => transformTeamUpdates(data), [data]);

  return {
    metrics,
    recentLogs,
    teamUpdates,
    rawSummary: data,
    loading: isLoading,
    isFetching,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refetch,
  };
}
