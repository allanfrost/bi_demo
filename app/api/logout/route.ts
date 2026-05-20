import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303
  })

  response.cookies.set("bi_session", "", {
    maxAge: 0,
    path: "/"
  })

  return response
}
