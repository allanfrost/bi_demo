import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BI Briefing",
  description: "AI-drevet ledelsesbriefing til CFO og ledelse"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
      </head>
      <body>{children}</body>
    </html>
  )
}
