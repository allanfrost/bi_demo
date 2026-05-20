import type { KPI } from "@/lib/mock-data"

type KpiCardProps = {
  kpi: KPI
}

const statusClasses: Record<KPI["status"], string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  critical: "bg-red-600"
}

export default function KpiCard({ kpi }: KpiCardProps) {
  const isPositive = kpi.trend >= 0

  return (
    <article className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
        <span
          aria-label={kpi.status}
          className={`h-2.5 w-2.5 rounded-full ${statusClasses[kpi.status]}`}
        />
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-normal text-slate-950">
        {kpi.formatted}
      </p>

      <div
        className={`mt-4 flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-emerald-700" : "text-red-700"
        }`}
      >
        <span aria-hidden="true">{isPositive ? "↑" : "↓"}</span>
        <span>{kpi.trendLabel}</span>
      </div>
    </article>
  )
}
