import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BI Briefing",
  description: "AI-drevet ledelsesbriefing til CFO og ledelse",
  applicationName: "BI Briefing",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "BI Briefing",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }]
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1e3a5f"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}
