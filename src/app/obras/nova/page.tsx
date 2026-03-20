'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createObra } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NovaObraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const obra = await createObra({
        quadra: formData.get('quadra') as string,
        lote: formData.get('lote') as string,
        empreiteiro: formData.get('empreiteiro') as string,
        endereco_completo: formData.get('endereco_completo') as string,
        observacoes: formData.get('observacoes') as string,
      })
      toast.success('Obra cadastrada com sucesso!')
      router.push(`/obras/${obra.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar obra.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/">
        <Button variant="ghost" className="-ml-4"><ArrowLeft className="w-4 h-4 mr-2"/> Voltar</Button>
      </Link>
      
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrar Nova Obra</CardTitle>
          <CardDescription>Informe os dados do endereço para criar a galeria de fotos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quadra">Quadra *</Label>
                <Input id="quadra" name="quadra" required autoFocus placeholder="Ex: 56" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lote">Lote *</Label>
                <Input id="lote" name="lote" required placeholder="Ex: 06" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empreiteiro">Empreiteiro (opcional)</Label>
              <Input id="empreiteiro" name="empreiteiro" placeholder="Ex: Dejackson" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco_completo">Endereço Completo (opcional)</Label>
              <Input id="endereco_completo" name="endereco_completo" placeholder="Rua, número, bairro..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Input id="observacoes" name="observacoes" placeholder="Qualquer detalhe extra da obra..." />
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Salvar Obra
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
