import { type Metadata } from 'next'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "@club-website/ui/components/sonner"
import { Providers } from "@/components/providers"
import { NavigationProvider } from "@/components/navigation/NavigationContext"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@club-website/ui/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "@club-website/ui/globals.css"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CS Club Officers Hub',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            <NavigationProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                  </header>
                  {/* Updated main content area with proper responsive padding */}
                  <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
                      {children}
                    </div>
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </NavigationProvider>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
