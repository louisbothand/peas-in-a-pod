import {
  Account,
  CapacityPlan,
  Team,
  TeamMember,
  WorkloadSnapshot,
} from "@/lib/capacity/types";

export function computeCell(
  plan?: CapacityPlan,
  workload?: WorkloadSnapshot
) {
  const budget = plan?.budget_hours ?? 0;
  const actual =
    (workload?.projects_estimated_hours ?? 0) +
    (workload?.desk_estimated_hours ?? 0);
  const logged =
    (workload?.logged_projects_hours ?? 0) +
    (workload?.logged_desk_hours ?? 0);

  const varianceActual = budget - actual;
  const varianceLogged = budget - logged;

  let status: "empty" | "under" | "near" | "over" = "empty";

  if (budget > 0) {
    if (actual > budget || logged > budget) status = "over";
    else if (actual >= budget * 0.9 || logged >= budget * 0.9) status = "near";
    else status = "under";
  }

  return { budget, actual, logged, varianceActual, varianceLogged, status };
}

export function getPlanForCell(
  capacityPlans: CapacityPlan[],
  sprintId: number,
  teamMemberId: number,
  accountId: number
) {
  return capacityPlans.find(
    (plan) =>
      plan.sprint_id === sprintId &&
      plan.team_member_id === teamMemberId &&
      plan.account_id === accountId
  );
}

export function getWorkloadForCell(
  workloadSnapshots: WorkloadSnapshot[],
  sprintId: number,
  teamMemberId: number,
  accountId: number
) {
  return workloadSnapshots.find(
    (snapshot) =>
      snapshot.sprint_id === sprintId &&
      snapshot.team_member_id === teamMemberId &&
      snapshot.account_id === accountId
  );
}

export function getMemberTotals(
  sprintId: number,
  teamMemberId: number,
  accounts: Account[],
  capacityPlans: CapacityPlan[],
  workloadSnapshots: WorkloadSnapshot[]
) {
  return accounts.reduce(
    (totals, account) => {
      const plan = getPlanForCell(capacityPlans, sprintId, teamMemberId, account.id);
      const workload = getWorkloadForCell(
        workloadSnapshots,
        sprintId,
        teamMemberId,
        account.id
      );
      const cell = computeCell(plan, workload);

      totals.budget += cell.budget;
      totals.actual += cell.actual;
      totals.logged += cell.logged;

      return totals;
    },
    { budget: 0, actual: 0, logged: 0 }
  );
}

export function getAccountTotals(
  sprintId: number,
  accountId: number,
  teamMembers: TeamMember[],
  capacityPlans: CapacityPlan[],
  workloadSnapshots: WorkloadSnapshot[]
) {
  return teamMembers.reduce(
    (totals, member) => {
      const plan = getPlanForCell(capacityPlans, sprintId, member.id, accountId);
      const workload = getWorkloadForCell(
        workloadSnapshots,
        sprintId,
        member.id,
        accountId
      );
      const cell = computeCell(plan, workload);

      totals.budget += cell.budget;
      totals.actual += cell.actual;
      totals.logged += cell.logged;

      return totals;
    },
    { budget: 0, actual: 0, logged: 0 }
  );
}

export function getTeamTotals(
  sprintId: number,
  teamId: number,
  teamMembers: TeamMember[],
  accounts: Account[],
  capacityPlans: CapacityPlan[],
  workloadSnapshots: WorkloadSnapshot[]
) {
  const membersInTeam = teamMembers.filter((member) => member.team_id === teamId);

  return membersInTeam.reduce(
    (totals, member) => {
      const memberTotals = getMemberTotals(
        sprintId,
        member.id,
        accounts,
        capacityPlans,
        workloadSnapshots
      );

      totals.budget += memberTotals.budget;
      totals.actual += memberTotals.actual;
      totals.logged += memberTotals.logged;

      return totals;
    },
    { budget: 0, actual: 0, logged: 0 }
  );
}

export function getGrandTotals(
  sprintId: number,
  teamMembers: TeamMember[],
  accounts: Account[],
  capacityPlans: CapacityPlan[],
  workloadSnapshots: WorkloadSnapshot[]
) {
  return teamMembers.reduce(
    (totals, member) => {
      const memberTotals = getMemberTotals(
        sprintId,
        member.id,
        accounts,
        capacityPlans,
        workloadSnapshots
      );

      totals.budget += memberTotals.budget;
      totals.actual += memberTotals.actual;
      totals.logged += memberTotals.logged;

      return totals;
    },
    { budget: 0, actual: 0, logged: 0 }
  );
}

export function getTeamsWithMembers(
  teams: Team[],
  teamMembers: TeamMember[],
  selectedTeamId: number | "all"
) {
  const filteredTeams =
    selectedTeamId === "all"
      ? teams
      : teams.filter((team) => team.id === selectedTeamId);

  return filteredTeams
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((team) => ({
      ...team,
      members: teamMembers
        .filter((member) => member.active && member.team_id === team.id)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    }));
}