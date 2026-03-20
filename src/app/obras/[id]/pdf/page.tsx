import { getObra } from '@/app/actions'
import { notFound } from 'next/navigation'
import PDFPreviewClient from './PDFPreviewClient'

export default async function PDFPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const obra = await getObra(params.id)
  
  if (!obra) {
    notFound()
  }

  return <PDFPreviewClient obra={obra} />
}
