import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'
import { Toast } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Paper Whisper',
  description: 'Criado por Eduardo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className='light'>
      <Providers>
        <body className={cn(
          'min-h-screen font-sans antialiased grainy', inter.className
        )}>
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  )
}
