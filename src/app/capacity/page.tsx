"use client";

import { useMemo, useState } from "react";
import CapacityGrid from "@/components/capacity/CapacityGrid";
import CapacitySummary from "@/components/capacity/CapacitySummary";
import CapacityToolbar from "@/components/capacity/CapacityToolbar";
import EditCapacityModal from "@/components/capacity/EditCapacityModal";

import {
  accounts,
  capacityPlans as initialCapacityPlans,
  sprints,
  teamMembers,
  teams,
  workloadSnapshots,
} from "@/lib/mock/seedData";

import {
  Account,
  CapacityPlan,
  TeamMember,
  WorkloadSnapshot,
} from "@/lib/capacity/types";
import {
  getPlanForCell,
  getWorkloadForCell,
} from "@/lib/capacity/calculations";

export default function CapacityPage() {
  const [selectedSprintId, setSelectedSprintId] = useState<number>(1);
  const [selectedTeamId, setSelectedTeamId] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"actual" | "logged">("actual");
  const [plans, setPlans] = useState<CapacityPlan[]>(initialCapacityPlans);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const selectedPlan = useMemo(() => {
    if (!selectedMember || !selectedAccount) return undefined;

    return getPlanForCell(
      plans,
      selectedSprintId,
      selectedMember.id,
      selectedAccount.id
    );
  }, [plans, selectedSprintId, selectedMember, selectedAccount]);

  const selectedWorkload = useMemo<WorkloadSnapshot | undefined>(() => {
    if (!selectedMember || !selectedAccount) return undefined;

    return getWorkloadForCell(
      workloadSnapshots,
      selectedSprintId,
      selectedMember.id,
      selectedAccount.id
    );
  }, [selectedSprintId, selectedMember, selectedAccount]);

  const activeSprint =
    sprints.find((sprint) => sprint.id === selectedSprintId) ?? sprints[0];

  const visibleTeams =
    selectedTeamId === "all"
      ? teams
      : teams.filter((team) => team.id === selectedTeamId);

  const visibleTeamIds = new Set(visibleTeams.map((team) => team.id));

  const visibleMembers = teamMembers.filter(
    (member) => member.active && visibleTeamIds.has(member.team_id)
  );

  function handleCellClick(args: {
    member: TeamMember;
    account: Account;
  }) {
    setSelectedMember(args.member);
    setSelectedAccount(args.account);
    setIsModalOpen(true);
  }

  function handleSavePlan(payload: {
    sprint_id: number;
    team_member_id: number;
    account_id: number;
    budget_hours: number;
    notes?: string;
  }) {
    setPlans((current) => {
      const existingIndex = current.findIndex(
        (plan) =>
          plan.sprint_id === payload.sprint_id &&
          plan.team_member_id === payload.team_member_id &&
          plan.account_id === payload.account_id
      );

      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          budget_hours: payload.budget_hours,
          notes: payload.notes,
        };
        return updated;
      }

      return [
        ...current,
        {
          id: Date.now(),
          sprint_id: payload.sprint_id,
          team_member_id: payload.team_member_id,
          account_id: payload.account_id,
          budget_hours: payload.budget_hours,
          notes: payload.notes,
        },
      ];
    });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1800px] space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Team Capacity Planner
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Lightweight MVP view for sprint capacity across Lowveld, Highveld,
            Bushveld, and any future teams.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Current sprint</div>
              <div className="mt-1 font-semibold text-slate-900">
                {activeSprint.sprint_name}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Visible teams</div>
              <div className="mt-1 font-semibold text-slate-900">
                {selectedTeamId === "all"
                  ? `${teams.length} teams`
                  : teams.find((t) => t.id === selectedTeamId)?.team_name}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Visible members</div>
              <div className="mt-1 font-semibold text-slate-900">
                {visibleMembers.length}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Accounts</div>
              <div className="mt-1 font-semibold text-slate-900">
                {accounts.length}
              </div>
            </div>
          </div>
        </div>

        <CapacityToolbar
          sprints={sprints}
          teams={teams}
          selectedSprintId={selectedSprintId}
          selectedTeamId={selectedTeamId}
          viewMode={viewMode}
          onSprintChange={setSelectedSprintId}
          onTeamChange={setSelectedTeamId}
          onViewModeChange={setViewMode}
        />

        <CapacityGrid
          sprintId={selectedSprintId}
          teams={teams}
          teamMembers={visibleMembers}
          accounts={accounts}
          capacityPlans={plans}
          workloadSnapshots={workloadSnapshots}
          selectedTeamId={selectedTeamId}
          onCellClick={handleCellClick}
        />

        <CapacitySummary
          sprintId={selectedSprintId}
          teams={visibleTeams}
          teamMembers={visibleMembers}
          accounts={accounts}
          capacityPlans={plans}
          workloadSnapshots={workloadSnapshots}
        />

        <EditCapacityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sprintId={selectedSprintId}
          member={selectedMember}
          account={selectedAccount}
          plan={selectedPlan}
          workload={selectedWorkload}
          onSave={handleSavePlan}
        />
      </div>
    </div>
  );
}