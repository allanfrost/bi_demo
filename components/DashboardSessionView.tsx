"use client"

import AnomalyBanner from "@/components/AnomalyBanner"
import BriefingPanel from "@/components/BriefingPanel"
import KpiCard from "@/components/KpiCard"
import RevenueChart from "@/components/RevenueChart"
import type { KPI, MonthlyRevenue } from "@/lib/mock-data"

type DashboardSessionViewProps = {
  name: string
  title: string
  kpis: KPI[]
  revenue: MonthlyRevenue
}

export default function DashboardSessionView({
  name,
  title,
  kpis,
  revenue
}: DashboardSessionViewProps) {
  return (
    <main className="min-h-dvh bg-slate-100">
      <header className="bg-[#1e3a5f] px-[max(1rem,env(safe-area-inset-left))] pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-xl font-semibold">BI Briefing</p>
          <form action="/api/logout" method="post" className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-slate-300">{title}</p>
            </div>
            <button
              type="submit"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#1e3a5f] transition hover:bg-slate-100"
            >
              Log ud
            </button>
          </form>
        </div>
      </header>
      <section className="mx-auto max-w-6xl space-y-6 px-[max(1rem,env(safe-area-inset-left))] pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:pt-8">
        <AnomalyBanner kpis={kpis} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
        <RevenueChart data={revenue} />
        <BriefingPanel kpis={kpis} userName={name} userTitle={title} />
      </section>
    </main>
  )
}
