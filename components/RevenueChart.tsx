"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import type { MonthlyRevenue } from "@/lib/mock-data"

type RevenueChartProps = {
  data: MonthlyRevenue
}

type DotProps = {
  cx?: number
  cy?: number
  index?: number
  payload?: { isLast?: boolean }
}

type TooltipProps = {
  active?: boolean
  label?: string
  payload?: Array<{ value: number }>
}

function formatMillions(value: number) {
  return `${(value / 1000000).toLocaleString("da-DK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}M`
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("da-DK")} kr.`
}

function RevenueTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-slate-500">Måned: {label}</p>
      <p className="mt-1 font-semibold text-slate-950">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

function RevenueDot({ cx, cy, payload }: DotProps) {
  if (cx === undefined || cy === undefined) {
    return null
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload?.isLast ? 5 : 3}
      fill="#2563eb"
      stroke="#ffffff"
      strokeWidth={2}
    />
  )
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    isLast: index === data.length - 1
  }))

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-500">
        Omsætning — seneste 12 måneder
      </h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatMillions}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              width={48}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={<RevenueDot />}
              activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
