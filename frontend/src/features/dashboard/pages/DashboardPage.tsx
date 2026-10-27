import { MetricCard } from '../components/MetricCard';
import { DashboardActivityTable } from '../components/DashboardActivityTable';
import { TeamUpdateItem } from '../components/TeamUpdateItem';
import { useDashboardData } from '../hooks/queries/useDashboardData';

export default function DashboardPage() {
  const { metrics, recentLogs, teamUpdates } = useDashboardData();

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Executive Overview
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Welcome back. Here is what's happening today.
          </p>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} colorIndex={idx} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Area */}
        <DashboardActivityTable logs={recentLogs} />

        {/* Side Panels */}
        <div className="space-y-6">
          <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-base text-[var(--color-text-primary)]">System Health</h2>
            </div>
            <div className="h-40 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 rounded-xl flex items-center justify-center border border-pink-500/20">
              <span className="font-semibold text-sm bg-gradient-to-r from-[#22B2B8] to-[#F43F5E] bg-clip-text text-transparent">99.9% Uptime</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-base text-[var(--color-text-primary)]">Admin Activity</h2>
            </div>
            <div className="space-y-4">
              {teamUpdates.map((update, idx) => (
                <TeamUpdateItem key={idx} {...update} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
