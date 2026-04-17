import { CapacityPlan, WorkloadSnapshot } from "./types";

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