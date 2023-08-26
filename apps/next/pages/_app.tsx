import 'raf/polyfill'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider, initialWindowMetrics } from 'app/provider'
import { trpc } from 'app/utils/trpc/index.web'
import Head from 'next/head'
import { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import type { AppProps } from 'next/app'
import { SolitoImageProvider } from 'solito/image'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

const imageURL = process.env.NEXT_PUBLIC_APP_URL as `http:${string}` | `https:${string}`

function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session | null }>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <>
      <Head>
        <title>T4 App</title>
        <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Component {...pageProps} />
        </SessionContextProvider>
      </ThemeProvider>
    </>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [_, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider>
        <SolitoImageProvider
          loader={({ quality, width, src }) => {
            return `${imageURL}${src}?w=${width}&q=${quality}`
          }}
        >
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>{children}</SafeAreaProvider>
        </SolitoImageProvider>
      </Provider>
    </NextThemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
