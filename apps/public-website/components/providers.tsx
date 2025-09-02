"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  // One-time fix: Clear any stored theme preference to restore system detection
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme')
    }
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  )
}
