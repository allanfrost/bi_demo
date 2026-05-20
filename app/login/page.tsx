import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginForm from "@/components/LoginForm"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("bi_session")

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1e3a5f] px-4 py-10">
      <div className="w-full">
        <p className="mb-6 text-center text-3xl font-semibold text-white">
          BI Briefing
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
