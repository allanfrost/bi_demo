"use client"

import { useState } from "react"
import type { KPI } from "@/lib/mock-data"

type AnomalyBannerProps = {
  kpis: KPI[]
}

export default function AnomalyBanner({ kpis }: AnomalyBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const issueKpis = kpis.filter((kpi) => kpi.status !== "ok")
  const hasCritical = issueKpis.some((kpi) => kpi.status === "critical")

  if (isDismissed || issueKpis.length === 0) {
    return null
  }

  const labels = issueKpis.map((kpi) => kpi.label).join(", ")
  // When severities are mixed, the banner uses red and lists every non-ok KPI.
  const text = hasCritical
    ? `⚠ Kritisk afvigelse — ${labels} kræver øjeblikkelig opmærksomhed`
    : `⚠ Advarsel — ${labels} er under forventet niveau`

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-lg px-4 py-3 text-sm font-medium ${
        hasCritical ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"
      }`}
    >
      <p>{text}</p>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Luk advarsel"
        className={`shrink-0 rounded px-2 py-0.5 text-lg leading-none transition ${
          hasCritical ? "hover:bg-red-100" : "hover:bg-amber-100"
        }`}
      >
        ×
      </button>
    </div>
  )
}
