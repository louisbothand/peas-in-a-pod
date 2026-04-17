import {
  Account,
  CapacityPlan,
  Team,
  TeamMember,
  WorkloadSnapshot,
} from "@/lib/capacity/types";
import {
  computeCell,
  getMemberTotals,
  getPlanForCell,
  getTeamsWithMembers,
  getWorkloadForCell,
} from "@/lib/capacity/calculations";
import CapacityCell from "./CapacityCell";

type CapacityGridProps = {
  sprintId: number;
  teams: Team[];
  teamMembers: TeamMember[];
  accounts: Account[];
  capacityPlans: CapacityPlan[];
  workloadSnapshots: WorkloadSnapshot[];
  selectedTeamId: number | "all";
  onCellClick: (args: {
    member: TeamMember;
    account: Account;
    plan?: CapacityPlan;
    workload?: WorkloadSnapshot;
  }) => void;
};

export default function CapacityGrid({
  sprintId,
  teams,
  teamMembers,
  accounts,
  capacityPlans,
  workloadSnapshots,
  selectedTeamId,
  onCellClick,
}: CapacityGridProps) {
  const groupedTeams = getTeamsWithMembers(teams, teamMembers, selectedTeamId);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="min-w-[1100px]">
        <div
          className="grid border-b border-slate-200 bg-slate-50"
          style={{
            gridTemplateColumns: `220px repeat(${accounts.length}, minmax(180px, 1fr)) 180px`,
          }}
        >
          <div className="p-4 text-sm font-semibold text-slate-700">Team Member</div>

          {accounts.map((account) => (
            <div key={account.id} className="p-4 text-sm font-semibold text-slate-700">
              <div>{account.account_name}</div>
              <div className="mt-1 text-xs font-normal text-slate-500">
                {account.account_code}
              </div>
            </div>
          ))}

          <div className="p-4 text-sm font-semibold text-slate-700">Row Total</div>
        </div>

        {groupedTeams.map((team) => (
          <div key={team.id}>
            <div
              className="grid border-b border-t border-slate-200 bg-slate-100"
              style={{
                gridTemplateColumns: `220px repeat(${accounts.length}, minmax(180px, 1fr)) 180px`,
              }}
            >
              <div className="col-span-full px-4 py-3 text-sm font-semibold text-slate-800">
                {team.team_name}
              </div>
            </div>

            {team.members.map((member) => {
              const totals = getMemberTotals(
                sprintId,
                member.id,
                accounts,
                capacityPlans,
                workloadSnapshots
              );

              return (
                <div
                  key={member.id}
                  className="grid border-b border-slate-200"
                  style={{
                    gridTemplateColumns: `220px repeat(${accounts.length}, minmax(180px, 1fr)) 180px`,
                  }}
                >
                  <div className="p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {member.full_name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {member.role_name} · Default sprint capacity:{" "}
                      {member.default_sprint_capacity_hours}h
                    </div>
                  </div>

                  {accounts.map((account) => {
                    const plan = getPlanForCell(
                      capacityPlans,
                      sprintId,
                      member.id,
                      account.id
                    );
                    const workload = getWorkloadForCell(
                      workloadSnapshots,
                      sprintId,
                      member.id,
                      account.id
                    );
                    const cell = computeCell(plan, workload);

                    return (
                      <div key={account.id} className="p-3">
                        <CapacityCell
                          budget={cell.budget}
                          actual={cell.actual}
                          logged={cell.logged}
                          varianceActual={cell.varianceActual}
                          varianceLogged={cell.varianceLogged}
                          status={cell.status}
                          onClick={() =>
                            onCellClick({
                              member,
                              account,
                              plan,
                              workload,
                            })
                          }
                        />
                      </div>
                    );
                  })}

                  <div className="p-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 text-xs font-medium text-slate-500">
                        Totals
                      </div>
                      <div className="space-y-1 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                          <span>Budget</span>
                          <span className="font-semibold">{totals.budget}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Actual</span>
                          <span className="font-semibold">{totals.actual}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Logged</span>
                          <span className="font-semibold">{totals.logged}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}