import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const obra1 = await prisma.obra.create({
    data: {
      quadra: '56',
      lote: '06',
      empreiteiro: 'Dejackson',
      endereco_completo: 'Rua das Flores, 123',
    },
  })

  const obra2 = await prisma.obra.create({
    data: {
      quadra: '56',
      lote: '07',
      empreiteiro: 'Construtora XYZ',
      endereco_completo: 'Rua das Flores, 145',
    },
  })

  console.log('Seed completed!', obra1.id, obra2.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
