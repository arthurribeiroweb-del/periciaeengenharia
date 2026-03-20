'use client'

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { RelatorioPDF } from './RelatorioPDF'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function PDFPreviewClient({ obra }: { obra: any }) {
  const [isClient, setIsClient] = useState(false)
  const [hostUrl, setHostUrl] = useState('')

  useEffect(() => {
    setIsClient(true)
    setHostUrl(window.location.origin)
  }, [])

  if (!isClient) return <div className="p-12 text-center text-gray-500 animate-pulse mt-10">Iniciando motor de PDF...</div>

  const obraWithFullUrls = {
    ...obra,
    fotos: obra.fotos.map((f: any) => ({
      ...f,
      arquivo: `${hostUrl}${f.arquivo}`
    }))
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[85vh] flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <Link href={`/obras/${obra.id}`}>
          <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2"/> Voltar para Obra</Button>
        </Link>
        <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg hidden sm:block text-gray-800">Q.{obra.quadra} - L.{obra.lote}</h2>
            <PDFDownloadLink document={<RelatorioPDF obra={obraWithFullUrls} />} fileName={`Relatorio_Q${obra.quadra}_L${obra.lote}.pdf`}>
            {({ loading }) => (
                <Button disabled={loading} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Preparando arquivo...' : 'Baixar PDF'}
                </Button>
            )}
            </PDFDownloadLink>
        </div>
      </div>

      <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-300">
        <PDFViewer width="100%" height="100%" className="border-none">
          <RelatorioPDF obra={obraWithFullUrls} />
        </PDFViewer>
      </div>
    </div>
  )
}
