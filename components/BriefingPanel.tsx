"use client"

import { useState } from "react"
import LoadingSpinner from "@/components/LoadingSpinner"
import type { KPI } from "@/lib/mock-data"

type BriefingPanelProps = {
  kpis: KPI[]
  userName: string
  userTitle: string
}

export default function BriefingPanel({
  kpis,
  userName,
  userTitle
}: BriefingPanelProps) {
  const [briefing, setBriefing] = useState("")
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function generateBriefing() {
    setBriefing("")
    setGeneratedAt(null)
    setError("")
    setIsLoading(true)

    const response = await fetch("/api/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kpis,
        user: {
          name: userName,
          title: userTitle
        }
      })
    })

    if (!response.ok || !response.body) {
      const body = (await response.json().catch(() => null)) as {
        error?: string
      } | null
      setError(body?.error ?? "Briefing kunne ikke genereres")
      setIsLoading(false)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      setBriefing((current) => current + decoder.decode(value, { stream: true }))
    }

    setGeneratedAt(new Date())
    setIsLoading(false)
  }

  async function copyBriefing() {
    await navigator.clipboard.writeText(briefing)
  }

  const generatedLabel = generatedAt
    ? `Genereret: ${generatedAt.toLocaleDateString("da-DK")} ${generatedAt.toLocaleTimeString("da-DK", {
        hour: "2-digit",
        minute: "2-digit"
      })}`
    : ""

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={generateBriefing}
        disabled={isLoading}
        className="w-full rounded-md bg-[#1e3a5f] px-5 py-3 font-semibold text-white transition hover:bg-[#172d49] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        Generer Briefing
      </button>

      {isLoading ? <LoadingSpinner /> : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      {briefing ? (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Ledelsesbriefing
              </p>
              {generatedLabel ? (
                <p className="mt-1 text-xs text-slate-500">{generatedLabel}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={copyBriefing}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Kopiér
            </button>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-800">
            {briefing}
          </div>
        </div>
      ) : null}
    </section>
  )
}
