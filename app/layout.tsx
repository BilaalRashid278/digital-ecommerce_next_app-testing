// app/layout.tsx

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import Provider from "@/components/provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

// Fetch info from API
async function fetchWebsiteInfo() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/public/website-info`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error("Failed to fetch website info")
    const data = await res.json()
    return data?.data
  } catch (error) {
    console.error("Error fetching website info:", error)
    return null
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const websiteInfo = await fetchWebsiteInfo()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3911231779133388');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Optional SEO Tags */}
        <title>{websiteInfo?.title || "Digital Products Marketplace"}</title>
        <meta name="description" content={websiteInfo?.description || "Premium digital products"} />
        <meta name="keywords" content={(websiteInfo?.keywords || []).join(", ")} />
        {websiteInfo?.favicon && (
          <link rel="icon" href={websiteInfo.favicon} />
        )}
        <meta name="facebook-domain-verification" content="n4hbhdrmd7eu3ect629swjsro8ba4e" />
      </head>

      <body className={inter.className}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3911231779133388&ev=PageView&noscript=1"
          />
        </noscript>

        <Provider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <div className="flex min-h-screen flex-col w-full">
                <Header websiteInfo={websiteInfo} />
                <div className="flex-1">{children}</div>
                <Footer websiteInfo={websiteInfo} />
              </div>
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}
