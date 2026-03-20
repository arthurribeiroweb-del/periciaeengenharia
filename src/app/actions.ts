'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function getObras(search?: string) {
  return await prisma.obra.findMany({
    where: search
      ? {
          OR: [
            { quadra: { contains: search } },
            { lote: { contains: search } },
            { empreiteiro: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { updated_at: 'desc' },
    include: {
      _count: {
        select: { fotos: true }
      }
    }
  })
}

export async function createObra(data: {
  quadra: string;
  lote: string;
  empreiteiro?: string;
  endereco_completo?: string;
  observacoes?: string;
}) {
  const obra = await prisma.obra.create({
    data,
  })
  revalidatePath('/')
  return obra
}

export async function getObra(id: string) {
  return await prisma.obra.findUnique({
    where: { id },
    include: {
      fotos: {
        orderBy: { ordem: 'asc' }
      }
    }
  })
}

export async function uploadFotos(obraId: string, formData: FormData) {
  const files = formData.getAll('files') as File[]
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (e) {}

  const savedFotos = []

  // const lastFoto
  const lastFoto = await prisma.foto.findFirst({
    where: { obra_id: obraId },
    orderBy: { ordem: 'desc' }
  })
  let currentOrdem = lastFoto ? lastFoto.ordem + 1 : 0

  for (const file of files) {
    if (file.size === 0) continue
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name) || '.jpg'
    const fileName = `${randomUUID()}${ext}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const foto = await prisma.foto.create({
      data: {
        obra_id: obraId,
        arquivo: `/uploads/${fileName}`,
        ordem: currentOrdem++,
      }
    })
    savedFotos.push(foto)
  }

  revalidatePath(`/obras/${obraId}`)
  revalidatePath('/')
  return true
}

export async function deleteFoto(id: string, obraId: string) {
  await prisma.foto.delete({ where: { id } })
  revalidatePath(`/obras/${obraId}`)
  revalidatePath('/')
}

export async function setFotoCapa(id: string, obraId: string) {
  await prisma.foto.updateMany({
    where: { obra_id: obraId },
    data: { capa: false }
  })
  await prisma.foto.update({
    where: { id },
    data: { capa: true }
  })
  revalidatePath(`/obras/${obraId}`)
}

export async function reorderFotos(obraId: string, orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.foto.update({
      where: { id: orderedIds[i] },
      data: { ordem: i }
    })
  }
  revalidatePath(`/obras/${obraId}`)
}

export async function finalizarObra(id: string) {
  await prisma.obra.update({
    where: { id },
    data: { status: 'finalizado' }
  })
  revalidatePath(`/obras/${id}`)
  revalidatePath('/')
}
