import { useState } from 'react';
import type { MetricCardProps } from '../../components/MetricCard';
import type { ActivityLogItem } from '../../components/DashboardActivityTable';
import type { TeamUpdateItemProps } from '../../components/TeamUpdateItem';

export function useDashboardData() {
  const [metrics] = useState<MetricCardProps[]>([
    { title: 'Total Users', value: '1,845', change: '+8.1%', trend: 'up' },
    { title: 'Active Roles', value: '12', change: 'Stable', trend: 'neutral' },
    { title: 'Security Alerts', value: '0', change: '-2.5%', trend: 'down' },
  ]);

  const [recentLogs] = useState<ActivityLogItem[]>([
    { user: 'Elon Hwarm', action: 'Login Successful', date: 'Apr 28, 2023', status: 'Success' },
    { user: 'Brio Niren', action: 'Password Reset', date: 'Jan 28, 2023', status: 'Success' },
    { user: 'Rick Dranin', action: 'Invalid Credentials', date: 'Jun 26, 2023', status: 'Failed' },
    { user: 'Lam Drohert', action: 'Role Assigned', date: 'Jun 25, 2023', status: 'Success' },
    { user: 'Ama Plenna', action: 'Logout', date: 'Jun 28, 2023', status: 'Success' },
  ]);

  const [teamUpdates] = useState<TeamUpdateItemProps[]>([
    { name: 'A. Chen', action: "Modified Role 'Editor'" },
    { name: 'Mark Omarter', action: "Created User 'r.doe@nexus.com'" },
    { name: 'Joan Joson', action: 'Revoked Token #892' },
  ]);

  return {
    metrics,
    recentLogs,
    teamUpdates,
  };
}
