import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardSessionView from "@/components/DashboardSessionView"
import { KPIS, MONTHLY_REVENUE } from "@/lib/mock-data"

function parseSession(value: string) {
  const [name, title] = value.split("||")

  // Simplest fallback: keep malformed cookies from crashing the protected page.
  return { name: name || "Bruger", title: title || "BI bruger" }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("bi_session")

  if (!session) {
    redirect("/login")
  }

  const user = parseSession(session.value)

  return (
    <DashboardSessionView
      name={user.name}
      title={user.title}
      kpis={KPIS}
      revenue={MONTHLY_REVENUE}
    />
  )
}
