import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "NeoStore - Download APK & Game Mod",
    template: "%s | NeoStore",
  },
  description: "Download aplikasi dan game mod terbaru dengan style Neo Brutalism modern. Aman, cepat, dan terpercaya.",
  keywords: ["apk download", "game mod", "android", "neo brutalism", "app store"],
  authors: [{ name: "NeoStore" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "NeoStore",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                border: "2px solid #0a0a0a",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                borderRadius: "0.75rem",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
