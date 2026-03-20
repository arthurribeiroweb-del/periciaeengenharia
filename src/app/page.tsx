import { getObras } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, MapPin, HardHat, Camera, FileText, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const obras = await getObras()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-xl border">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Obras e Projetos</h2>
          <p className="text-muted-foreground mt-1">Gerencie as fotos e gere relatórios PDf por endereço.</p>
        </div>
        <Link href="/obras/nova">
          <Button size="lg"><Plus className="mr-2 h-5 w-5" /> Nova Obra</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {obras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="pb-3 border-b bg-gray-50/30">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Q.{obra.quadra} - L.{obra.lote}</CardTitle>
                {obra.status === 'finalizado' ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Finalizado
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Em Andamento
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {obra.endereco_completo && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-400" />
                  <span>{obra.endereco_completo}</span>
                </div>
              )}
              {obra.empreiteiro ? (
                <div className="flex items-center text-sm text-gray-600">
                  <HardHat className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                  <span>{obra.empreiteiro}</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-400 italic">
                  <HardHat className="w-4 h-4 mr-2 shrink-0 opacity-50" />
                  <span>Sem empreiteiro</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Camera className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                <span>{obra._count.fotos} Fotos anexadas</span>
              </div>
              
              <div className="pt-4 flex justify-between gap-3">
                <Link href={`/obras/${obra.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">Abrir Fotos</Button>
                </Link>
                {obra.status === 'finalizado' && (
                  <Link href={`/obras/${obra.id}/pdf`}>
                    <Button variant="secondary" title="Gerar PDF"><FileText className="w-4 h-4" /></Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {obras.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50 border-2 border-dashed rounded-xl">
            <HardHat className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma obra cadastrada</h3>
            <p className="mb-4 text-sm">Comece cadastrando um novo endereço para gerenciar fotos.</p>
            <Link href="/obras/nova">
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Cadastrar Primeira Obra</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
