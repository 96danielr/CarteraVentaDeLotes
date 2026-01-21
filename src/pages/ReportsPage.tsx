import { useState, useMemo } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExecutiveReportPDF, ReportData } from '@/components/pdf/ExecutiveReportPDF';
import { BusinessLogicPDF } from '@/components/pdf/BusinessLogicPDF';
import { formatCurrency } from '@/utils/formatters';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';

type PeriodType = 'week' | 'month' | 'quarter' | 'year';

export function ReportsPage() {
  const { user } = useAuth();
  const { projects, lots, payments, users } = useData();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [downloading, setDownloading] = useState(false);
  const [downloadingSpec, setDownloadingSpec] = useState(false);

  const periodDates = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return { start, end };
  }, [period]);

  const metrics = useMemo(() => {
    const { start, end } = periodDates;

    // Pagos del período
    const periodPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate >= start && paymentDate <= end;
    });

    // Pagos del período anterior
    const prevStart = new Date(start);
    prevStart.setTime(prevStart.getTime() - (end.getTime() - start.getTime()));

    const prevPeriodPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate >= prevStart && paymentDate < start;
    });

    const totalCollected = periodPayments.reduce((sum, p) => sum + p.amount, 0);
    const prevCollected = prevPeriodPayments.reduce((sum, p) => sum + p.amount, 0);
    const collectedChange = prevCollected > 0 ? ((totalCollected - prevCollected) / prevCollected) * 100 : 0;

    // Conteo de lotes
    const soldLots = lots.filter(l => l.status === 'sold');
    const reservedLots = lots.filter(l => l.status === 'reserved');
    const availableLots = lots.filter(l => l.status === 'available');

    const totalSales = soldLots.reduce((sum, l) => sum + l.price, 0);

    // Clientes únicos
    const uniqueClientIds = new Set(periodPayments.map(p => p.clientId));

    // Cobranza esperada
    const activeLots = lots.filter(l => l.status === 'sold' || l.status === 'reserved');
    const expectedCollection = activeLots.reduce((sum, l) => sum + (l.monthlyPayment || 0), 0);
    const collectionRate = expectedCollection > 0 ? (totalCollected / expectedCollection) * 100 : 100;

    // Pagos por tipo
    const downPayments = periodPayments.filter(p => p.type === 'down_payment').reduce((sum, p) => sum + p.amount, 0);
    const monthlyPayments = periodPayments.filter(p => p.type === 'monthly').reduce((sum, p) => sum + p.amount, 0);
    const extraPayments = periodPayments.filter(p => p.type === 'extra').reduce((sum, p) => sum + p.amount, 0);

    // Tendencia mensual (últimos 6 meses)
    const monthlyTrend: { month: string; amount: number }[] = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPayments = payments.filter(p => {
        const pDate = new Date(p.date);
        return pDate >= monthStart && pDate <= monthEnd;
      });

      monthlyTrend.push({
        month: months[date.getMonth()],
        amount: monthPayments.reduce((sum, p) => sum + p.amount, 0),
      });
    }

    // Cartera vencida
    const today = new Date();
    const overdueClients: { client: string; lot: string; amount: number; daysOverdue: number }[] = [];

    activeLots.forEach(lot => {
      if (!lot.startDate || !lot.monthlyPayment) return;

      const lotPayments = payments.filter(p => p.lotId === lot.id && p.type === 'monthly');
      const monthsPaid = lotPayments.length;
      const startDate = new Date(lot.startDate);

      const monthsDiff = Math.floor((today.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000));

      if (monthsDiff > monthsPaid) {
        const client = users.find(u => u.id === lot.clientId);
        const daysOverdue = Math.floor((today.getTime() - new Date(startDate.getTime() + monthsPaid * 30 * 24 * 60 * 60 * 1000).getTime()) / (24 * 60 * 60 * 1000));

        if (daysOverdue > 0) {
          overdueClients.push({
            client: client?.name || 'N/A',
            lot: lot.number,
            amount: lot.monthlyPayment * (monthsDiff - monthsPaid),
            daysOverdue,
          });
        }
      }
    });

    const overdueAmount = overdueClients.reduce((sum, o) => sum + o.amount, 0);

    // Resumen por proyecto
    const projectsSummary = projects.map(project => {
      const projectLots = lots.filter(l => l.projectId === project.id);
      const soldCount = projectLots.filter(l => l.status === 'sold').length;
      const reservedCount = projectLots.filter(l => l.status === 'reserved').length;
      const availableCount = projectLots.filter(l => l.status === 'available').length;
      const revenue = projectLots
        .filter(l => l.status === 'sold' || l.status === 'reserved')
        .reduce((sum, l) => sum + l.price, 0);
      const progress = projectLots.length > 0 ? ((soldCount + reservedCount) / projectLots.length) * 100 : 0;

      return {
        name: project.name,
        totalLots: projectLots.length,
        soldLots: soldCount,
        reservedLots: reservedCount,
        availableLots: availableCount,
        revenue,
        progress,
      };
    });

    // Pagos recientes
    const recentPayments = periodPayments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(p => {
        const client = users.find(u => u.id === p.clientId);
        const lot = lots.find(l => l.id === p.lotId);
        return {
          date: new Date(p.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
          client: client?.name || 'N/A',
          lot: lot?.number || 'N/A',
          amount: p.amount,
          type: p.type === 'down_payment' ? 'Enganche' : p.type === 'monthly' ? 'Mensualidad' : 'Extra',
        };
      });

    return {
      totalSales,
      totalCollected,
      collectedChange,
      lotsSold: soldLots.length,
      lotsReserved: reservedLots.length,
      lotsAvailable: availableLots.length,
      collectionRate,
      expectedCollection,
      clientsCount: uniqueClientIds.size,
      overdueAmount,
      overdueClients,
      projectsSummary,
      recentPayments,
      monthlyTrend,
      paymentsByType: [
        { type: 'Enganches', amount: downPayments, color: '#8b5cf6' },
        { type: 'Mensualidades', amount: monthlyPayments, color: '#10b981' },
        { type: 'Extras', amount: extraPayments, color: '#0ea5e9' },
      ],
    };
  }, [periodDates, payments, lots, projects, users]);

  const getPeriodLabel = () => {
    const { start, end } = periodDates;
    const formatOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${start.toLocaleDateString('es-CO', formatOptions)} - ${end.toLocaleDateString('es-CO', formatOptions)}`;
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const reportData: ReportData = {
        period,
        periodLabel: getPeriodLabel(),
        generatedAt: new Date().toLocaleString('es-CO'),
        generatedBy: user?.name || 'Sistema',
        kpis: {
          totalSales: metrics.totalSales,
          totalCollected: metrics.totalCollected,
          collectedChange: metrics.collectedChange,
          lotsSold: metrics.lotsSold,
          lotsReserved: metrics.lotsReserved,
          lotsAvailable: metrics.lotsAvailable,
          collectionRate: metrics.collectionRate,
          clientsCount: metrics.clientsCount,
        },
        monthlyTrend: metrics.monthlyTrend,
        projectsSummary: metrics.projectsSummary,
        paymentsByType: metrics.paymentsByType,
        collectionSummary: {
          expected: metrics.expectedCollection,
          collected: metrics.totalCollected,
          pending: Math.max(metrics.expectedCollection - metrics.totalCollected, 0),
          overdue: metrics.overdueAmount,
        },
        recentPayments: metrics.recentPayments,
        overduePayments: metrics.overdueClients,
      };

      const blob = await pdf(<ExecutiveReportPDF data={reportData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_Ejecutivo_${period}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBusinessLogic = async () => {
    setDownloadingSpec(true);
    try {
      const blob = await pdf(<BusinessLogicPDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Especificacion_Logica_Negocio_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloadingSpec(false);
    }
  };

  // Datos para gráficas en pantalla
  const lotDistributionData = [
    { label: 'Vendidos', value: metrics.lotsSold, color: '#ef4444' },
    { label: 'Reservados', value: metrics.lotsReserved, color: '#f59e0b' },
    { label: 'Disponibles', value: metrics.lotsAvailable, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reportes Ejecutivos</h1>
          <p className="text-muted-foreground">Informes con gráficas para reuniones</p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={downloading}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
        >
          {downloading ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          {downloading ? 'Generando PDF...' : 'Exportar Informe PDF'}
        </Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Período:</span>
            </div>
            <div className="flex rounded-xl border border-white/10 overflow-hidden">
              {[
                { value: 'week', label: 'Última Semana' },
                { value: 'month', label: 'Último Mes' },
                { value: 'quarter', label: 'Trimestre' },
                { value: 'year', label: 'Año' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value as PeriodType)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    period === p.value
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-500 ml-auto">{getPeriodLabel()}</span>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Ventas Totales</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(metrics.totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Recaudado</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalCollected)}</p>
                <p className={`text-xs font-medium ${metrics.collectedChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.collectedChange >= 0 ? '▲' : '▼'} {Math.abs(metrics.collectedChange).toFixed(1)}% vs anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Lotes Vendidos</p>
                <p className="text-2xl font-bold">{metrics.lotsSold}</p>
                <p className="text-xs text-slate-500">{metrics.lotsReserved} reservados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <Users className="h-7 w-7 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Clientes Activos</p>
                <p className="text-2xl font-bold">{metrics.clientsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut - Distribución de Lotes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <DonutChart
                data={lotDistributionData}
                size={180}
                centerValue={`${metrics.lotsSold + metrics.lotsReserved + metrics.lotsAvailable}`}
                centerLabel="Total"
              />
            </div>
          </CardContent>
        </Card>

        {/* Gauge / Progress - Tasa de Cobranza */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Cobranza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-700"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={metrics.collectionRate >= 80 ? '#10b981' : metrics.collectionRate >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(metrics.collectionRate / 100) * 251.2} 251.2`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{metrics.collectionRate.toFixed(0)}%</span>
                  <span className="text-xs text-slate-400">Cobranza</span>
                </div>
              </div>
              <div className="flex gap-8 mt-4 text-sm">
                <div className="text-center">
                  <p className="text-slate-400">Meta</p>
                  <p className="font-bold">{formatCurrency(metrics.expectedCollection)}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Recaudado</p>
                  <p className="font-bold text-emerald-400">{formatCurrency(metrics.totalCollected)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Tendencia Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Recaudo Mensual (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <BarChart
              data={metrics.monthlyTrend.map(m => ({ label: m.month, value: m.amount }))}
              height={240}
              formatValue={(v) => formatCurrency(v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumen por Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.projectsSummary.map((project, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white">{project.name}</h4>
                    <div className="flex gap-4 mt-1 text-sm">
                      <span className="text-rose-400">{project.soldLots} vendidos</span>
                      <span className="text-amber-400">{project.reservedLots} reservados</span>
                      <span className="text-emerald-400">{project.availableLots} disponibles</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">{formatCurrency(project.revenue)}</p>
                    <p className="text-xs text-slate-400">ingresos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{project.progress.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cartera Vencida Alert */}
      {metrics.overdueAmount > 0 && (
        <Card className="border-rose-500/30 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              Cartera Vencida - Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-sm text-rose-300">Total vencido</p>
                <p className="text-3xl font-bold text-rose-400">{formatCurrency(metrics.overdueAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-rose-300">Clientes en mora</p>
                <p className="text-3xl font-bold text-rose-400">{metrics.overdueClients.length}</p>
              </div>
            </div>
            <div className="space-y-2">
              {metrics.overdueClients.slice(0, 5).map((client, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div>
                    <p className="font-medium">{client.client}</p>
                    <p className="text-sm text-slate-400">Lote {client.lot}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-400">{formatCurrency(client.amount)}</p>
                    <p className="text-xs text-rose-300">{client.daysOverdue} días de atraso</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF Preview CTA */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500/20">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Informe Ejecutivo PDF</h3>
              <p className="text-slate-400 mb-6">
                Informe con gráficas, KPIs y tablas para reuniones ejecutivas.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 mb-6">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" /> Gráficas
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" /> KPIs
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" /> Cartera
                </span>
              </div>
              <Button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 mr-2" />
                )}
                Descargar Informe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/20">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Especificación de Negocio</h3>
              <p className="text-slate-400 mb-6">
                Documento con toda la lógica de negocio para revisión del cliente.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400 mb-6">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-purple-400" /> Flujos
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-purple-400" /> Roles
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-purple-400" /> Reglas
                </span>
              </div>
              <Button
                onClick={handleDownloadBusinessLogic}
                disabled={downloadingSpec}
                variant="outline"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                {downloadingSpec ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 mr-2" />
                )}
                Descargar Especificación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
