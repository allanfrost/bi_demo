export type KPI = {
  id: string
  label: string
  value: number
  formatted: string
  unit: string
  trend: number
  trendLabel: string
  status: "ok" | "warn" | "critical"
  description: string
}

export const KPIS: KPI[] = [
  {
    id: "revenue",
    label: "Omsætning",
    value: 4200000,
    formatted: "4.200.000 kr.",
    unit: "kr.",
    trend: 3.2,
    trendLabel: "+3,2% vs. sidste måned",
    status: "ok",
    description: "Omsætningen er 4.200.000 kr. og ligger 3,2% over sidste måned."
  },
  {
    id: "margin",
    label: "Bruttomargin",
    value: 68,
    formatted: "68,0%",
    unit: "%",
    trend: -1.8,
    trendLabel: "-1,8% vs. sidste måned",
    status: "warn",
    description: "Bruttomarginen er 68,0% og ligger 1,8% under sidste måned."
  },
  {
    id: "customers",
    label: "Aktive kunder",
    value: 47,
    formatted: "47",
    unit: "kunder",
    trend: 2,
    trendLabel: "+2,0% vs. sidste måned",
    status: "ok",
    description: "Antallet af aktive kunder er 47 og er steget 2,0% siden sidste måned."
  },
  {
    id: "project_size",
    label: "Gns. projektstørrelse",
    value: 89400,
    formatted: "89.400 kr.",
    unit: "kr.",
    trend: 5.1,
    trendLabel: "+5,1% vs. sidste måned",
    status: "ok",
    description: "Den gennemsnitlige projektstørrelse er 89.400 kr. og er steget 5,1% siden sidste måned."
  }
]

export const MONTHLY_REVENUE = [
  { month: "jun", value: 3400000 },
  { month: "jul", value: 3550000 },
  { month: "aug", value: 3480000 },
  { month: "sep", value: 3700000 },
  { month: "okt", value: 3850000 },
  { month: "nov", value: 3920000 },
  { month: "dec", value: 3750000 },
  { month: "jan", value: 3900000 },
  { month: "feb", value: 4050000 },
  { month: "mar", value: 4100000 },
  { month: "apr", value: 4180000 },
  { month: "maj", value: 4200000 }
]

export type MonthlyRevenue = typeof MONTHLY_REVENUE
