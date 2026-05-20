"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    setIsSubmitting(false)

    if (response.ok) {
      router.push("/dashboard")
      router.refresh()
      return
    }

    const body = (await response.json()) as { error?: string }
    setError(body.error ?? "Login mislykkedes")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
    >
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold text-[#1e3a5f]">BI Briefing</p>
        <p className="mt-2 text-sm text-slate-500">Log ind på din briefing</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Adgangskode</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-[#1e3a5f] px-4 py-2.5 font-semibold text-white transition hover:bg-[#172d49] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Logger ind..." : "Log ind"}
      </button>
    </form>
  )
}
