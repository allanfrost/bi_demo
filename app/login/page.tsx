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
    <main className="flex min-h-dvh items-center justify-center bg-[#1e3a5f] px-[max(1rem,env(safe-area-inset-left))] py-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="flex w-full justify-center">
        <LoginForm />
      </div>
    </main>
  )
}
