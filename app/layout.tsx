import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from 'next/font/google'
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MAES Laboratory Management System",
  description: "Professional laboratory management system for Maria Estrella General Hospital",
  keywords: "laboratory, medical, healthcare, hospital, MAES, Maria Estrella",
  authors: [{ name: "MAES Laboratory Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
