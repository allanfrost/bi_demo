import { NextResponse } from "next/server"
import { DEMO_USERS } from "@/lib/mock-users"

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string
    password?: string
  }

  const user = DEMO_USERS.find(
    (demoUser) => demoUser.email === email && demoUser.password === password
  )

  if (!user) {
    return NextResponse.json(
      { error: "Ugyldigt brugernavn eller adgangskode" },
      { status: 401 }
    )
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url), {
    status: 303
  })

  response.cookies.set("bi_session", `${user.name}||${user.title}`, {
    httpOnly: true,
    maxAge: 86400,
    path: "/",
    sameSite: "lax"
  })

  return response
}
