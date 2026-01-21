import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Payment, User, Lot, Project } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '2px solid #10b981',
    paddingBottom: 20,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  companySubtitle: {
    fontSize: 9,
    color: '#10b981',
    textAlign: 'center',
    marginTop: 2,
  },
  receiptTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
    color: '#0f172a',
  },
  receiptNumber: {
    fontSize: 14,
    textAlign: 'center',
    color: '#10b981',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30,
  },
  amountBox: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 4,
    border: '2px solid #10b981',
    marginBottom: 30,
    textAlign: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#166534',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #e2e8f0',
  },
  label: {
    color: '#64748b',
    fontSize: 10,
  },
  value: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    fontSize: 10,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: '1px solid #334155',
    marginTop: 40,
    paddingTop: 5,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
  badge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const paymentTypeLabels: Record<string, string> = {
  down_payment: 'Enganche',
  monthly: 'Mensualidad',
  extra: 'Pago Extra',
};

const paymentMethodLabels: Record<string, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia Bancaria',
  card: 'Tarjeta de Crédito/Débito',
  check: 'Cheque',
};

interface PaymentReceiptPDFProps {
  payment: Payment;
  client: User;
  lot: Lot;
  project: Project;
}

export function PaymentReceiptPDF({ payment, client, lot, project }: PaymentReceiptPDFProps) {
  const generatedDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>INVERSIONES TERRA VALORIS S.A.S</Text>
          <Text style={styles.companySubtitle}>NIT: 000.000.000-0 • Bogotá, Colombia</Text>
        </View>

        {/* Receipt Title */}
        <Text style={styles.receiptTitle}>RECIBO DE PAGO</Text>
        <Text style={styles.receiptNumber}>No. {payment.receiptNumber}</Text>

        {/* Amount Box */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>MONTO RECIBIDO</Text>
          <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
          <Text style={styles.badge}>PAGADO</Text>
        </View>

        {/* Two columns */}
        <View style={styles.twoColumn}>
          {/* Payment Info */}
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalles del Pago</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de pago:</Text>
                <Text style={styles.value}>{formatDate(payment.date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{paymentTypeLabels[payment.type]}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Método:</Text>
                <Text style={styles.value}>{paymentMethodLabels[payment.method]}</Text>
              </View>
              {payment.paymentNumber && (
                <View style={styles.row}>
                  <Text style={styles.label}>No. de cuota:</Text>
                  <Text style={styles.value}>{payment.paymentNumber}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Client Info */}
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cliente</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{client.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{client.email}</Text>
              </View>
              {client.phone && (
                <View style={styles.row}>
                  <Text style={styles.label}>Teléfono:</Text>
                  <Text style={styles.value}>{client.phone}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Lot Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inmueble</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Proyecto:</Text>
                <Text style={styles.value}>{project.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ubicación:</Text>
                <Text style={styles.value}>{project.location}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Lote:</Text>
                <Text style={styles.value}>{lot.block ? `${lot.block}-` : ''}{lot.number}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Área:</Text>
                <Text style={styles.value}>{lot.area} m²</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {payment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={{ color: '#334155', lineHeight: 1.5 }}>{payment.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Firma del Cliente</Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Firma Autorizada</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Documento generado el {generatedDate}</Text>
          <Text style={{ marginTop: 4 }}>Inversiones Terra Valoris S.A.S • Sistema de Gestión de Cartera</Text>
          <Text style={{ marginTop: 4 }}>Este recibo es válido como comprobante de pago. Conserve este documento.</Text>
        </View>
      </Page>
    </Document>
  );
}
