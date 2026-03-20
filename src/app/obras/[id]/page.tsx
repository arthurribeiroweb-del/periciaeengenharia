import { getObra } from '@/app/actions'
import { notFound } from 'next/navigation'
import ObraDetailsClient from './ObraDetailsClient'

export default async function ObraPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const obra = await getObra(params.id)
  
  if (!obra) {
    notFound()
  }

  // We need to pass clean data to the Client Component
  return <ObraDetailsClient initialObra={obra} />
}
