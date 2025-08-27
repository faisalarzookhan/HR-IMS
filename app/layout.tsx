import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { OrganizationProvider } from "@/components/OrganizationProvider"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import OfflineIndicator from "@/components/OfflineIndicator"

export const metadata: Metadata = {
  title: "Limitless Infotech - HR Management System",
  description: "Comprehensive HR Management System by Limitless Infotech Solutions",
  generator: "v0.dev",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HR-IMS",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="apple-touch-icon" href="/logo192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HR-IMS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <OrganizationProvider>
            <LanguageProvider>
              <OfflineIndicator />
              {children}
              <PWAInstallPrompt />
            </LanguageProvider>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
