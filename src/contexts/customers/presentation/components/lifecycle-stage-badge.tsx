import { CustomerLifecycleStage, LIFECYCLE_STAGE_LABELS } from "../../domain/entities/customer";

const LIFECYCLE_STAGE_STYLES: Record<CustomerLifecycleStage, string> = {
  LEAD: "bg-slate-100 text-slate-700",
  PROSPECT: "bg-blue-100 text-blue-700",
  ACTIVE_CUSTOMER: "bg-green-100 text-green-700",
  RECURRING_CUSTOMER: "bg-emerald-100 text-emerald-700",
  CHURNED: "bg-red-100 text-red-700",
  WIN_BACK: "bg-amber-100 text-amber-700",
};

interface LifecycleStageBadgeProps {
  stage: CustomerLifecycleStage;
}

export function LifecycleStageBadge({ stage }: LifecycleStageBadgeProps) {
  const style = LIFECYCLE_STAGE_STYLES[stage] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {LIFECYCLE_STAGE_LABELS[stage] ?? stage}
    </span>
  );
}
