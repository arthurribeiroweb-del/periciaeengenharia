import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Perícia & Engenharia - Gestão de Obras',
  description: 'Sistema de gestão de fotos e emissão de relatórios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-xl text-primary flex items-center gap-2">
              <span className="bg-primary text-white p-1.5 rounded-md">P&E</span>
              Perícia e Engenharia
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
