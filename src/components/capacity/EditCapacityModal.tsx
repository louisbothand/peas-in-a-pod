"use client";

import { useEffect, useState } from "react";
import {
  Account,
  CapacityPlan,
  TeamMember,
  WorkloadSnapshot,
} from "@/lib/capacity/types";
import { computeCell } from "@/lib/capacity/calculations";

type EditCapacityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sprintId: number;
  member: TeamMember | null;
  account: Account | null;
  plan?: CapacityPlan;
  workload?: WorkloadSnapshot;
  onSave: (payload: {
    sprint_id: number;
    team_member_id: number;
    account_id: number;
    budget_hours: number;
    notes?: string;
  }) => void;
};

export default function EditCapacityModal({
  isOpen,
  onClose,
  sprintId,
  member,
  account,
  plan,
  workload,
  onSave,
}: EditCapacityModalProps) {
  const [budgetHours, setBudgetHours] = useState<number>(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setBudgetHours(plan?.budget_hours ?? 0);
    setNotes(plan?.notes ?? "");
  }, [plan]);

  if (!isOpen || !member || !account) return null;

  const preview = computeCell(
    {
      sprint_id: sprintId,
      team_member_id: member.id,
      account_id: account.id,
      budget_hours: budgetHours,
      notes,
    },
    workload
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit capacity plan</h2>
          <p className="mt-1 text-sm text-slate-500">
            {member.full_name} · {account.account_name}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">Actual</div>
                <div className="font-semibold text-slate-900">
                  {preview.actual}h
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Logged</div>
                <div className="font-semibold text-slate-900">
                  {preview.logged}h
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">New budget</div>
                <div className="font-semibold text-slate-900">
                  {preview.budget}h
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white p-3">
                <div className="text-xs text-slate-500">Projects</div>
                <div className="mt-1 text-slate-800">
                  {workload?.projects_task_count ?? 0} tasks ·{" "}
                  {workload?.projects_estimated_hours ?? 0}h estimated ·{" "}
                  {workload?.logged_projects_hours ?? 0}h logged
                </div>
              </div>

              <div className="rounded-xl bg-white p-3">
                <div className="text-xs text-slate-500">Desk</div>
                <div className="mt-1 text-slate-800">
                  {workload?.desk_ticket_count ?? 0} tickets ·{" "}
                  {workload?.desk_estimated_hours ?? 0}h estimated ·{" "}
                  {workload?.logged_desk_hours ?? 0}h logged
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Budget hours
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={budgetHours}
              onChange={(e) => setBudgetHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
              placeholder="Optional notes for this person/account/sprint"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onSave({
                sprint_id: sprintId,
                team_member_id: member.id,
                account_id: account.id,
                budget_hours: budgetHours,
                notes,
              });
              onClose();
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Save plan
          </button>
        </div>
      </div>
    </div>
  );
}