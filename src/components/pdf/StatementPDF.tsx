import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Statement } from '@/types';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2px solid #10b981',
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  companySubtitle: {
    fontSize: 8,
    color: '#10b981',
    marginTop: 2,
  },
  companyDetail: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#0f172a',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: '#64748b',
  },
  value: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  summaryBox: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    border: '1px solid #bbf7d0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#166534',
  },
  summaryValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  summaryTotal: {
    borderTop: '1px solid #86efac',
    marginTop: 8,
    paddingTop: 8,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 8,
    color: '#ffffff',
  },
  tableHeaderCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    padding: 8,
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  col1: { width: '12%' },
  col2: { width: '20%' },
  col3: { width: '18%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  col6: { width: '20%', textAlign: 'right' },
  progressBar: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
  },
  badgePaid: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgePending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  badgeOverdue: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Payment type labels
const paymentTypeLabels: Record<string, string> = {
  down_payment: 'Enganche',
  monthly: 'Mensualidad',
  extra: 'Extra',
};

interface StatementPDFProps {
  statement: Statement;
}

export function StatementPDF({ statement }: StatementPDFProps) {
  const { client, lot, project, payments, totalPrice, totalPaid, remaining, paidPercentage } = statement;
  const generatedDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>INVERSIONES TERRA VALORIS</Text>
            <Text style={styles.companySubtitle}>S.A.S</Text>
            <Text style={styles.companyDetail}>NIT: 000.000.000-0</Text>
            <Text style={styles.companyDetail}>Bogotá, Colombia</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Fecha de generación:</Text>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{generatedDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>ESTADO DE CUENTA</Text>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cliente</Text>
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

        {/* Lot Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Lote</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Proyecto:</Text>
            <Text style={styles.value}>{project.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.value}>{project.location}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lote:</Text>
            <Text style={styles.value}>{lot.block ? `${lot.block}-` : ''}{lot.number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Área:</Text>
            <Text style={styles.value}>{lot.area} m²</Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio Total del Lote:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pagado:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={[styles.summaryLabel, { fontSize: 13 }]}>Saldo Pendiente:</Text>
            <Text style={[styles.summaryValue, { fontSize: 13 }]}>{formatCurrency(remaining)}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(paidPercentage, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>Progreso de pago: {paidPercentage.toFixed(1)}%</Text>
        </View>

        {/* Payment Plan Info */}
        {lot.monthlyPayment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plan de Pagos</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Enganche:</Text>
              <Text style={styles.value}>{formatCurrency(lot.downPayment || 0)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mensualidad:</Text>
              <Text style={styles.value}>{formatCurrency(lot.monthlyPayment)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plazo:</Text>
              <Text style={styles.value}>{lot.totalMonths} meses</Text>
            </View>
            {lot.startDate && (
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de inicio:</Text>
                <Text style={styles.value}>{formatDate(lot.startDate)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Pagos</Text>
          {payments.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
                <Text style={[styles.tableHeaderCell, styles.col2]}>Fecha</Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>Recibo</Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>Tipo</Text>
                <Text style={[styles.tableHeaderCell, styles.col5]}>Método</Text>
                <Text style={[styles.tableHeaderCell, styles.col6]}>Monto</Text>
              </View>
              {payments.map((payment, index) => (
                <View
                  key={payment.id}
                  style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
                >
                  <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>{formatDate(payment.date)}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{payment.receiptNumber}</Text>
                  <Text style={[styles.tableCell, styles.col4]}>
                    {paymentTypeLabels[payment.type] || payment.type}
                  </Text>
                  <Text style={[styles.tableCell, styles.col5]}>
                    {payment.method === 'cash' ? 'Efectivo' :
                     payment.method === 'transfer' ? 'Transferencia' :
                     payment.method === 'card' ? 'Tarjeta' : 'Cheque'}
                  </Text>
                  <Text style={[styles.tableCell, styles.col6]}>{formatCurrency(payment.amount)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#64748b', fontStyle: 'italic' }}>No hay pagos registrados</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Inversiones Terra Valoris S.A.S • Sistema de Gestión de Cartera</Text>
          <Text style={{ marginTop: 4 }}>Este documento es un estado de cuenta informativo. Para cualquier aclaración, contacte a su asesor.</Text>
        </View>
      </Page>
    </Document>
  );
}
