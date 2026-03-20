import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
    marginBottom: 20
  },
  headerLeft: { flexDirection: 'column' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#111827' },
  subtitle: { fontSize: 11, color: '#4b5563', marginBottom: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  photoContainer: {
    width: '47%', // 2 cols with gap
    marginBottom: 15,
  },
  photo: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 4
  },
  caption: {
    fontSize: 9,
    marginTop: 6,
    color: '#6b7280',
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  }
})

// slice array into chunks of 6 (2x3)
const chunk = (arr: any[], size: number) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

export const RelatorioPDF = ({ obra }: { obra: any }) => {
  const fotosChunks = chunk(obra.fotos || [], 6)

  return (
    <Document>
      {fotosChunks.length === 0 ? (
        <Page size="A4" style={styles.page}>
           <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Relatório Fotográfico</Text>
              <Text style={styles.subtitle}>Quadra {obra.quadra} - Lote {obra.lote}</Text>
            </View>
          </View>
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'grey' }}>Nenhuma foto anexada a este relatório.</Text>
        </Page>
      ) : (
        fotosChunks.map((fotosPage, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>Relatório Fotográfico</Text>
                <Text style={styles.subtitle}>Quadra {obra.quadra} - Lote {obra.lote}</Text>
                {obra.empreiteiro && <Text style={styles.subtitle}>Empreiteiro: {obra.empreiteiro}</Text>}
                {obra.endereco_completo && <Text style={styles.subtitle}>Endereço: {obra.endereco_completo}</Text>}
              </View>
              <View>
                <Text style={styles.subtitle}>{format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</Text>
              </View>
            </View>

            <View style={styles.grid}>
              {fotosPage.map((foto, idx) => (
                <View key={foto.id} style={styles.photoContainer}>
                  <Image src={foto.arquivo} style={styles.photo} />
                  <Text style={styles.caption}>Foto {pageIndex * 6 + idx + 1}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
              `Página ${pageNumber} de ${totalPages}`
            )} fixed />
          </Page>
        ))
      )}
    </Document>
  )
}
