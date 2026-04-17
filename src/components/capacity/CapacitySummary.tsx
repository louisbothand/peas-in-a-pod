import {
  Account,
  CapacityPlan,
  Team,
  TeamMember,
  WorkloadSnapshot,
} from "@/lib/capacity/types";
import {
  getAccountTotals,
  getGrandTotals,
  getTeamTotals,
} from "@/lib/capacity/calculations";

type CapacitySummaryProps = {
  sprintId: number;
  teams: Team[];
  teamMembers: TeamMember[];
  accounts: Account[];
  capacityPlans: CapacityPlan[];
  workloadSnapshots: WorkloadSnapshot[];
};

function SummaryStat({
  label,
  budget,
  actual,
  logged,
}: {
  label: string;
  budget: number;
  actual: number;
  logged: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold text-slate-800">{label}</div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl bg-slate-50 p-2">
          <div className="text-xs text-slate-500">Budget</div>
          <div className="font-semibold text-slate-900">{budget}h</div>
        </div>
        <div className="rounded-xl bg-blue-50 p-2">
          <div className="text-xs text-slate-500">Actual</div>
          <div className="font-semibold text-slate-900">{actual}h</div>
        </div>
        <div className="rounded-xl bg-violet-50 p-2">
          <div className="text-xs text-slate-500">Logged</div>
          <div className="font-semibold text-slate-900">{logged}h</div>
        </div>
      </div>
    </div>
  );
}

export default function CapacitySummary({
  sprintId,
  teams,
  teamMembers,
  accounts,
  capacityPlans,
  workloadSnapshots,
}: CapacitySummaryProps) {
  const grandTotals = getGrandTotals(
    sprintId,
    teamMembers,
    accounts,
    capacityPlans,
    workloadSnapshots
  );

  return (
    <div className="space-y-4">
      <SummaryStat
        label="Overall totals"
        budget={grandTotals.budget}
        actual={grandTotals.actual}
        logged={grandTotals.logged}
      />

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Totals by team</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => {
            const totals = getTeamTotals(
              sprintId,
              team.id,
              teamMembers,
              accounts,
              capacityPlans,
              workloadSnapshots
            );

            return (
              <SummaryStat
                key={team.id}
                label={team.team_name}
                budget={totals.budget}
                actual={totals.actual}
                logged={totals.logged}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Totals by account</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
          {accounts.map((account) => {
            const totals = getAccountTotals(
              sprintId,
              account.id,
              teamMembers,
              capacityPlans,
              workloadSnapshots
            );

            return (
              <SummaryStat
                key={account.id}
                label={account.account_name}
                budget={totals.budget}
                actual={totals.actual}
                logged={totals.logged}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}