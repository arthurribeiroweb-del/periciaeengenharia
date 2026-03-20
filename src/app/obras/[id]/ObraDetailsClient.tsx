'use client'

import { useState, useRef } from 'react'
import { uploadFotos, deleteFoto, setFotoCapa, finalizarObra } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, UploadCloud, Trash2, Star, CheckCircle, FileText, Camera } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'

type Obra = any;

export default function ObraDetailsClient({ initialObra }: { initialObra: Obra }) {
  const [obra] = useState(initialObra)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFinalizado = obra.status === 'finalizado'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const formData = new FormData()
    Array.from(e.target.files).forEach(file => {
      formData.append('files', file)
    })

    setUploading(true)
    try {
      await uploadFotos(obra.id, formData)
      toast.success('Fotos enviadas com sucesso!')
      window.location.reload()
    } catch (err) {
      toast.error('Erro ao enviar fotos.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (fotoId: string) => {
    if (!confirm('Excluir esta foto?')) return
    await deleteFoto(fotoId, obra.id)
    toast.success('Foto excluída.')
    window.location.reload()
  }

  const handleSetCapa = async (fotoId: string) => {
    await setFotoCapa(fotoId, obra.id)
    toast.success('Capa definida.')
    window.location.reload()
  }

  const handleFinalizar = async () => {
    if (!confirm('Deseja realmente confirmar e finalizar as fotos desta obra?')) return
    await finalizarObra(obra.id)
    toast.success('Obra finalizada com sucesso!')
    window.location.reload()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="-ml-4"><ArrowLeft className="w-4 h-4 mr-2"/> Voltar</Button>
        </Link>
        {isFinalizado && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Lote Finalizado
          </span>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Q.{obra.quadra} - L.{obra.lote}</h2>
          <p className="text-gray-500 mt-1">{obra.endereco_completo || 'Sem endereço detalhado'}</p>
          <div className="text-sm mt-3 bg-gray-50 inline-block px-3 py-1.5 rounded-md border text-gray-700">
            <strong>Empreiteiro:</strong> {obra.empreiteiro || 'Não informado'}
          </div>
          {obra.observacoes && (
            <p className="mt-3 text-sm text-gray-600"><strong>Obs:</strong> {obra.observacoes}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 min-w-[200px]">
          {isFinalizado ? (
            <Link href={`/obras/${obra.id}/pdf`} className="w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow">
                <FileText className="w-5 h-5 mr-2" /> Gerar PDF
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={handleFinalizar} className="w-full bg-green-600 hover:bg-green-700 text-white shadow flex-1">
              <CheckCircle className="w-5 h-5 mr-2" /> Finalizar Obra
            </Button>
          )}
          {!isFinalizado && (
            <p className="text-xs text-center text-gray-500 mt-1">
              Finalize para permitir a criação do PDF.
            </p>
          )}
        </div>
      </div>

      {!isFinalizado && (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${uploading ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-600'}`}>
              <UploadCloud className={`w-8 h-8 ${uploading ? 'animate-bounce' : ''}`} />
            </div>
            <h3 className="text-lg font-medium mb-2">Adicionar fotos à obra</h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              Faça upload de múltiplas imagens JPG ou PNG correspondentes à obra.
            </p>
            <Input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png, image/jpg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} size="lg">
              {uploading ? 'Enviando imagens...' : 'Selecionar Imagens'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
          <span>Galeria de Fotos ({obra.fotos?.length || 0})</span>
        </h3>
        
        {obra.fotos?.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-xl bg-gray-50">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
            Nenhuma foto carregada para este endereço.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {obra.fotos?.map((foto: any) => (
              <div key={foto.id} className="group relative border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="relative aspect-square w-full bg-gray-100">
                  <Image 
                    src={foto.arquivo} 
                    alt="Foto da obra" 
                    fill 
                    unoptimized
                    className="object-cover"
                  />
                  {foto.capa && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-md shadow flex items-center">
                      <Star className="w-3 h-3 mr-1.5 fill-yellow-900" /> Capa
                    </div>
                  )}
                </div>
                
                {!isFinalizado && (
                  <div className="p-2 border-t flex justify-between bg-white sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleSetCapa(foto.id)} title="Marcar como capa" className={foto.capa ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}>
                      <Star className={`w-4 h-4 ${foto.capa ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(foto.id)} title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
