import { Sprint, Team } from "@/lib/capacity/types";

type CapacityToolbarProps = {
  sprints: Sprint[];
  teams: Team[];
  selectedSprintId: number;
  selectedTeamId: number | "all";
  viewMode: "actual" | "logged";
  onSprintChange: (value: number) => void;
  onTeamChange: (value: number | "all") => void;
  onViewModeChange: (value: "actual" | "logged") => void;
};

export default function CapacityToolbar({
  sprints,
  teams,
  selectedSprintId,
  selectedTeamId,
  viewMode,
  onSprintChange,
  onTeamChange,
  onViewModeChange,
}: CapacityToolbarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sprint
            </label>
            <select
              value={selectedSprintId}
              onChange={(e) => onSprintChange(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0"
            >
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.sprint_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Team / Pod
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) =>
                onTeamChange(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0"
            >
              <option value="all">All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Highlight based on
            </label>
            <select
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as "actual" | "logged")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0"
            >
              <option value="actual">Budget vs Actual</option>
              <option value="logged">Budget vs Logged</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Click any grid cell to edit planned capacity.
        </div>
      </div>
    </div>
  );
}