type CapacityCellProps = {
  budget: number;
  actual: number;
  logged: number;
  varianceActual: number;
  varianceLogged: number;
  status: "empty" | "under" | "near" | "over";
  onClick?: () => void;
};

function getCellClasses(status: CapacityCellProps["status"]) {
  if (status === "over") {
    return "border-red-300 bg-red-50 hover:bg-red-100";
  }

  if (status === "near") {
    return "border-amber-300 bg-amber-50 hover:bg-amber-100";
  }

  if (status === "under") {
    return "border-emerald-300 bg-emerald-50 hover:bg-emerald-100";
  }

  return "border-slate-200 bg-slate-50 hover:bg-slate-100";
}

function getBadgeClasses(status: CapacityCellProps["status"]) {
  if (status === "over") return "bg-red-100 text-red-700";
  if (status === "near") return "bg-amber-100 text-amber-700";
  if (status === "under") return "bg-emerald-100 text-emerald-700";
  return "bg-slate-200 text-slate-600";
}

export default function CapacityCell({
  budget,
  actual,
  logged,
  varianceActual,
  varianceLogged,
  status,
  onClick,
}: CapacityCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-[180px] rounded-xl border p-3 text-left transition ${getCellClasses(
        status
      )}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">Capacity</span>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getBadgeClasses(
            status
          )}`}
        >
          {status === "empty"
            ? "No plan"
            : status === "under"
            ? "Under"
            : status === "near"
            ? "Near"
            : "Over"}
        </span>
      </div>

      <div className="space-y-1 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Budget</span>
          <span className="font-semibold">{budget}h</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Actual</span>
          <span className="font-semibold">{actual}h</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Logged</span>
          <span className="font-semibold">{logged}h</span>
        </div>
      </div>

      <div className="mt-3 space-y-1 border-t border-slate-200 pt-2 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Budget - Actual</span>
          <span className={varianceActual < 0 ? "font-semibold text-red-600" : "font-medium text-slate-700"}>
            {varianceActual}h
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Budget - Logged</span>
          <span className={varianceLogged < 0 ? "font-semibold text-red-600" : "font-medium text-slate-700"}>
            {varianceLogged}h
          </span>
        </div>
      </div>
    </button>
  );
}