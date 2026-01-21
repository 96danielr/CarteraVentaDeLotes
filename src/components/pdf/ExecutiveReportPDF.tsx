import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  G,
  Line,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from '@react-pdf/renderer';

const colors = {
  primary: '#10b981',
  primaryLight: '#34d399',
  secondary: '#0ea5e9',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  dark: '#0f172a',
  darkLight: '#1e293b',
  gray: '#64748b',
  grayLight: '#94a3b8',
  border: '#334155',
  white: '#ffffff',
};

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
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  headerLeft: { flex: 1 },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
  },
  companySubtitle: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  headerRight: { alignItems: 'flex-end' },
  reportTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 4,
  },
  reportPeriod: { fontSize: 10, color: colors.gray },
  reportDate: { fontSize: 8, color: colors.grayLight, marginTop: 4 },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  // KPI Cards
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  kpiCardPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 8,
    color: colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  kpiLabelLight: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  kpiValue: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: colors.dark },
  kpiValueLight: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: colors.white },
  kpiChange: { fontSize: 8, color: colors.primary, marginTop: 2 },
  kpiChangeNeg: { fontSize: 8, color: colors.danger, marginTop: 2 },

  // Charts
  chartContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.dark,
    marginBottom: 10,
  },
  chartRow: { flexDirection: 'row', gap: 15 },
  chartCol: { flex: 1 },

  // Legend
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 8, color: colors.gray },

  // Table
  table: { width: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textTransform: 'uppercase',
  },
  tableHeaderCellRight: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCell: { flex: 1, fontSize: 9, color: colors.dark },
  tableCellBold: { flex: 1, fontSize: 9, color: colors.dark, fontFamily: 'Helvetica-Bold' },
  tableCellRight: { flex: 1, fontSize: 9, color: colors.dark, textAlign: 'right' },
  tableCellGreen: { flex: 1, fontSize: 9, color: colors.primary, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  tableCellRed: { flex: 1, fontSize: 9, color: colors.danger, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: { fontSize: 8, color: colors.grayLight },
  footerBrand: { fontSize: 8, color: colors.primary, fontFamily: 'Helvetica-Bold' },

  twoCol: { flexDirection: 'row', gap: 15 },
  col: { flex: 1 },
});

interface ReportData {
  period: string;
  periodLabel: string;
  generatedAt: string;
  generatedBy: string;
  kpis: {
    totalSales: number;
    totalCollected: number;
    collectedChange: number;
    lotsSold: number;
    lotsReserved: number;
    lotsAvailable: number;
    collectionRate: number;
    clientsCount: number;
  };
  monthlyTrend: { month: string; amount: number }[];
  projectsSummary: {
    name: string;
    soldLots: number;
    reservedLots: number;
    availableLots: number;
    revenue: number;
    progress: number;
  }[];
  paymentsByType: { type: string; amount: number; color: string }[];
  collectionSummary: {
    expected: number;
    collected: number;
    pending: number;
    overdue: number;
  };
  recentPayments: {
    date: string;
    client: string;
    lot: string;
    amount: number;
    type: string;
  }[];
  overduePayments: {
    client: string;
    lot: string;
    amount: number;
    daysOverdue: number;
  }[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Donut Chart Component - uses Path arcs for better compatibility
function DonutChart({ data, size = 100 }: { data: { value: number; color: string; label: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2 - 10;
  const strokeWidth = 18;
  const center = size / 2;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  let accumulatedAngle = -90; // Start from top

  const segments = data.map((item) => {
    const percent = total > 0 ? (item.value / total) : 0;
    const angle = percent * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle = endAngle;

    if (percent <= 0) return null;

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;

    // For full circle (100%)
    if (percent >= 0.9999) {
      return {
        path: `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius}`,
        color: item.color,
      };
    }

    return {
      path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      color: item.color,
    };
  }).filter(Boolean);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      {/* Data segments as arcs */}
      {segments.map((segment, index) => (
        <Path
          key={index}
          d={segment!.path}
          fill="none"
          stroke={segment!.color}
          strokeWidth={strokeWidth}
        />
      ))}
      {/* Center white circle */}
      <Circle cx={center} cy={center} r={radius - strokeWidth / 2 - 5} fill="#ffffff" />
    </Svg>
  );
}

// Bar Chart Component
function BarChart({ data, width = 200, height = 100 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = (width - 40) / data.length - 8;
  const chartHeight = height - 30;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={colors.primary} />
          <Stop offset="100%" stopColor={colors.primaryLight} />
        </LinearGradient>
      </Defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <Line
          key={i}
          x1={35}
          y1={chartHeight * (1 - ratio) + 5}
          x2={width - 5}
          y2={chartHeight * (1 - ratio) + 5}
          stroke="#e2e8f0"
          strokeWidth={0.5}
        />
      ))}
      {/* Bars */}
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = 40 + index * (barWidth + 8);
        const y = chartHeight - barHeight + 5;

        return (
          <G key={index}>
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#barGradient)"
              rx={3}
            />
            {/* Label */}
            <Text
              x={x + barWidth / 2}
              y={height - 5}
              style={{ fontSize: 7, fill: colors.gray, textAnchor: 'middle' } as any}
            >
              {item.label}
            </Text>
            {/* Value */}
            <Text
              x={x + barWidth / 2}
              y={y - 4}
              style={{ fontSize: 7, fill: colors.dark, fontWeight: 'bold', textAnchor: 'middle' } as any}
            >
              {formatCurrency(item.value)}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

// Horizontal Bar Chart
function HorizontalBarChart({ data, width = 200, height = 120 }: { data: { label: string; value: number; color: string }[]; width?: number; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barHeight = 16;
  const gap = 8;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * (width - 80);
        const y = index * (barHeight + gap) + 10;

        return (
          <G key={index}>
            {/* Background */}
            <Rect x={60} y={y} width={width - 80} height={barHeight} fill="#e2e8f0" rx={4} />
            {/* Bar */}
            <Rect x={60} y={y} width={Math.max(barWidth, 5)} height={barHeight} fill={item.color} rx={4} />
            {/* Label */}
            <Text x={0} y={y + 11} style={{ fontSize: 8, fill: colors.dark } as any}>
              {item.label}
            </Text>
            {/* Value */}
            <Text
              x={width - 5}
              y={y + 11}
              style={{ fontSize: 8, fill: colors.dark, fontWeight: 'bold', textAnchor: 'end' } as any}
            >
              {formatCurrency(item.value)}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

// Gauge Chart
function GaugeChart({ value, size = 100 }: { value: number; size?: number }) {
  const radius = size / 2 - 15;
  const center = size / 2;
  const startAngle = -180;
  const endAngle = 0;
  const range = endAngle - startAngle;
  const valueAngle = startAngle + (value / 100) * range;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const valuePoint = polarToCartesian(valueAngle);

  const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  const valuePath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${valuePoint.x} ${valuePoint.y}`;

  return (
    <Svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
      {/* Background arc */}
      <Path d={arcPath} fill="none" stroke="#e2e8f0" strokeWidth={12} strokeLinecap="round" />
      {/* Value arc */}
      <Path
        d={valuePath}
        fill="none"
        stroke={value >= 80 ? colors.primary : value >= 50 ? colors.warning : colors.danger}
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Center text */}
      <Text
        x={center}
        y={center}
        style={{ fontSize: 16, fontWeight: 'bold', fill: colors.dark, textAnchor: 'middle' } as any}
      >
        {value.toFixed(0)}%
      </Text>
      <Text
        x={center}
        y={center + 12}
        style={{ fontSize: 7, fill: colors.gray, textAnchor: 'middle' } as any}
      >
        Cobranza
      </Text>
    </Svg>
  );
}

export function ExecutiveReportPDF({ data }: { data: ReportData }) {
  const lotDistribution = [
    { value: data.kpis.lotsSold, color: colors.danger, label: 'Vendidos' },
    { value: data.kpis.lotsReserved, color: colors.warning, label: 'Reservados' },
    { value: data.kpis.lotsAvailable, color: colors.primary, label: 'Disponibles' },
  ];

  return (
    <Document>
      {/* PAGE 1: Dashboard Ejecutivo */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>INVERSIONES</Text>
            <Text style={styles.companySubtitle}>TERRA VALORIS S.A.S</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Informe Ejecutivo</Text>
            <Text style={styles.reportPeriod}>{data.periodLabel}</Text>
            <Text style={styles.reportDate}>Generado: {data.generatedAt}</Text>
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicadores Clave de Desempeño</Text>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCardPrimary}>
              <Text style={styles.kpiLabelLight}>Ventas del Período</Text>
              <Text style={styles.kpiValueLight}>{formatCurrencyFull(data.kpis.totalSales)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Recaudado</Text>
              <Text style={styles.kpiValue}>{formatCurrencyFull(data.kpis.totalCollected)}</Text>
              <Text style={data.kpis.collectedChange >= 0 ? styles.kpiChange : styles.kpiChangeNeg}>
                {data.kpis.collectedChange >= 0 ? '▲' : '▼'} {Math.abs(data.kpis.collectedChange).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Clientes Activos</Text>
              <Text style={styles.kpiValue}>{data.kpis.clientsCount}</Text>
            </View>
          </View>
        </View>

        {/* Charts Row */}
        <View style={styles.section}>
          <View style={styles.twoCol}>
            {/* Donut Chart - Distribución de Lotes */}
            <View style={[styles.chartContainer, styles.col]}>
              <Text style={styles.chartTitle}>Distribución de Lotes</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <DonutChart data={lotDistribution} size={90} />
                <View style={{ flex: 1 }}>
                  {lotDistribution.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={{ fontSize: 9, color: colors.dark, marginLeft: 6 }}>
                        {item.label}: {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Gauge - Tasa de Cobranza */}
            <View style={[styles.chartContainer, styles.col]}>
              <Text style={styles.chartTitle}>Tasa de Cobranza</Text>
              <View style={{ alignItems: 'center' }}>
                <GaugeChart value={data.kpis.collectionRate} size={120} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 8, color: colors.gray }}>Meta: {formatCurrency(data.collectionSummary.expected)}</Text>
                <Text style={{ fontSize: 8, color: colors.primary }}>Real: {formatCurrency(data.collectionSummary.collected)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bar Chart - Tendencia Mensual */}
        <View style={styles.section}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Recaudo Mensual</Text>
            <View style={{ alignItems: 'center' }}>
              <BarChart data={data.monthlyTrend.map(m => ({ label: m.month, value: m.amount }))} width={480} height={120} />
            </View>
          </View>
        </View>

        {/* Horizontal Bar - Por Tipo de Pago */}
        <View style={styles.section}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Recaudo por Tipo de Pago</Text>
            <HorizontalBarChart data={data.paymentsByType.map(p => ({ label: p.type, value: p.amount, color: p.color }))} width={480} height={80} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>Documento confidencial</Text>
            <Text style={styles.footerBrand}>Terra Valoris S.A.S</Text>
          </View>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* PAGE 2: Detalle por Proyecto */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>INVERSIONES</Text>
            <Text style={styles.companySubtitle}>TERRA VALORIS S.A.S</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Análisis por Proyecto</Text>
            <Text style={styles.reportPeriod}>{data.periodLabel}</Text>
          </View>
        </View>

        {/* Projects Summary with Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avance por Proyecto</Text>
          {data.projectsSummary.map((project, index) => (
            <View key={index} style={{ marginBottom: 15, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.dark }}>{project.name}</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.primary }}>{formatCurrencyFull(project.revenue)}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 15, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger, marginRight: 4 }} />
                  <Text style={{ fontSize: 8, color: colors.gray }}>Vendidos: {project.soldLots}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning, marginRight: 4 }} />
                  <Text style={{ fontSize: 8, color: colors.gray }}>Reservados: {project.reservedLots}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 4 }} />
                  <Text style={{ fontSize: 8, color: colors.gray }}>Disponibles: {project.availableLots}</Text>
                </View>
              </View>
              {/* Progress bar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ width: `${project.progress}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.primary }}>{project.progress.toFixed(0)}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Collection Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Cobranza</Text>
          <View style={styles.twoCol}>
            <View style={[styles.chartContainer, styles.col, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 9, color: '#166534' }}>Esperado:</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534' }}>{formatCurrencyFull(data.collectionSummary.expected)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 9, color: '#166534' }}>Recaudado:</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534' }}>{formatCurrencyFull(data.collectionSummary.collected)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 9, color: '#166534' }}>Pendiente:</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534' }}>{formatCurrencyFull(data.collectionSummary.pending)}</Text>
              </View>
            </View>
            {data.collectionSummary.overdue > 0 ? (
              <View style={[styles.chartContainer, styles.col, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#991b1b', marginBottom: 8 }}>⚠ Cartera Vencida</Text>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#991b1b' }}>{formatCurrencyFull(data.collectionSummary.overdue)}</Text>
                <Text style={{ fontSize: 8, color: '#991b1b', marginTop: 4 }}>{data.overduePayments.length} clientes en mora</Text>
              </View>
            ) : (
              <View style={[styles.chartContainer, styles.col, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#166534', marginBottom: 8 }}>✓ Sin Cartera Vencida</Text>
                <Text style={{ fontSize: 10, color: '#166534' }}>Excelente gestión</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Payments Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos Pagos Recibidos</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Fecha</Text>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
              <Text style={styles.tableHeaderCell}>Lote</Text>
              <Text style={styles.tableHeaderCell}>Tipo</Text>
              <Text style={styles.tableHeaderCellRight}>Monto</Text>
            </View>
            {data.recentPayments.slice(0, 10).map((payment, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={styles.tableCell}>{payment.date}</Text>
                <Text style={styles.tableCellBold}>{payment.client}</Text>
                <Text style={styles.tableCell}>{payment.lot}</Text>
                <Text style={styles.tableCell}>{payment.type}</Text>
                <Text style={styles.tableCellGreen}>{formatCurrencyFull(payment.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerText}>Generado por: {data.generatedBy}</Text>
            <Text style={styles.footerBrand}>Terra Valoris S.A.S</Text>
          </View>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* PAGE 3: Cartera Vencida (si hay) */}
      {data.overduePayments.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.companyName}>INVERSIONES</Text>
              <Text style={styles.companySubtitle}>TERRA VALORIS S.A.S</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={[styles.reportTitle, { color: colors.danger }]}>Cartera Vencida</Text>
              <Text style={styles.reportPeriod}>Atención Requerida</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ backgroundColor: '#fef2f2', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#fecaca' }}>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#991b1b', marginBottom: 5 }}>
                Total Cartera Vencida: {formatCurrencyFull(data.collectionSummary.overdue)}
              </Text>
              <Text style={{ fontSize: 9, color: '#991b1b' }}>
                {data.overduePayments.length} clientes con pagos atrasados requieren seguimiento inmediato
              </Text>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableHeader, { backgroundColor: '#991b1b' }]}>
                <Text style={styles.tableHeaderCell}>Cliente</Text>
                <Text style={styles.tableHeaderCell}>Lote</Text>
                <Text style={styles.tableHeaderCellRight}>Monto Vencido</Text>
                <Text style={styles.tableHeaderCellRight}>Días Atraso</Text>
              </View>
              {data.overduePayments.map((payment, index) => (
                <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={styles.tableCellBold}>{payment.client}</Text>
                  <Text style={styles.tableCell}>{payment.lot}</Text>
                  <Text style={styles.tableCellRed}>{formatCurrencyFull(payment.amount)}</Text>
                  <Text style={styles.tableCellRed}>{payment.daysOverdue} días</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footer} fixed>
            <View>
              <Text style={styles.footerText}>Documento confidencial</Text>
              <Text style={styles.footerBrand}>Terra Valoris S.A.S</Text>
            </View>
            <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
}

export type { ReportData };
