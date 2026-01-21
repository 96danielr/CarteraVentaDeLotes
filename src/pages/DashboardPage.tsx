import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { formatCurrency, formatDateShort, getLotStatusLabel } from '@/utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  Users,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building2,
  Sparkles,
  Calendar,
  Receipt,
  Target,
  Wallet,
  CheckCircle,
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { projects, lots, payments, getClients, getLotsByClient, getPaymentsByClient } = useData();

  // Dashboard para cliente
  if (user?.role === 'cliente') {
    const clientLots = getLotsByClient(user.id);
    const clientPayments = getPaymentsByClient(user.id);
    const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 border border-white/10 p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hola, {user.name}</h1>
              <p className="text-slate-400">Bienvenido a tu panel de control</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Mis Lotes</p>
              <p className="text-3xl font-bold text-white">{clientLots.length}</p>
              <p className="text-xs text-slate-500 mt-1">propiedades asignadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Pagado</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-slate-500 mt-1">en pagos acumulados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Pagos Realizados</p>
              <p className="text-3xl font-bold text-white">{clientPayments.length}</p>
              <p className="text-xs text-slate-500 mt-1">transacciones completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* My Lots */}
        {clientLots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Mis Lotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientLots.map(lot => {
                  const project = projects.find(p => p.id === lot.projectId);
                  const lotPayments = payments.filter(p => p.lotId === lot.id);
                  const paid = lotPayments.reduce((sum, p) => sum + p.amount, 0);
                  const progress = (paid / lot.price) * 100;

                  return (
                    <div key={lot.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-white">Lote {lot.number}</p>
                          <p className="text-sm text-slate-400">{project?.name}</p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {getLotStatusLabel(lot.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progreso de pago</span>
                          <span className="font-medium text-white">{formatCurrency(paid)} / {formatCurrency(lot.price)}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-right text-slate-500">{progress.toFixed(1)}% completado</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Dashboard para admin/master/comercial
  const metrics = useMemo(() => {
    const clients = getClients();
    const totalLots = lots.length;
    const soldLots = lots.filter((l) => l.status === 'sold').length;
    const reservedLots = lots.filter((l) => l.status === 'reserved').length;
    const availableLots = lots.filter((l) => l.status === 'available').length;

    const totalSales = lots
      .filter((l) => l.status === 'sold' || l.status === 'reserved')
      .reduce((sum, l) => sum + l.price, 0);

    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

    const totalExpected = lots
      .filter((l) => l.status === 'sold' || l.status === 'reserved')
      .reduce((sum, l) => sum + l.price, 0);

    const pendingCollection = totalExpected - totalCollected;
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

    const monthlyPayments = getMonthlyPayments(payments);

    const recentPayments = [...payments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalProjects: projects.length,
      totalLots,
      soldLots,
      reservedLots,
      availableLots,
      totalSales,
      totalCollected,
      pendingCollection,
      collectionRate,
      clientsCount: clients.length,
      monthlyPayments,
      recentPayments,
      clients,
    };
  }, [projects, lots, payments, getClients]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const lotStatusData = [
    { label: 'Disponibles', value: metrics.availableLots, color: '#10b981' },
    { label: 'Apartados', value: metrics.reservedLots, color: '#f59e0b' },
    { label: 'Vendidos', value: metrics.soldLots, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 border border-white/10 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
              <Sparkles className="h-4 w-4" />
              <span>{getGreeting()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {user?.name}
            </h1>
            <p className="text-slate-400">
              Resumen de tu cartera inmobiliaria
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/projects">
                <Building2 className="h-4 w-4 mr-2" />
                Ver Proyectos
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/statements">
                <Receipt className="h-4 w-4 mr-2" />
                Estados de Cuenta
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ventas Totales"
          value={formatCurrency(metrics.totalSales)}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true }}
          color="emerald"
        />
        <MetricCard
          title="Recaudado"
          value={formatCurrency(metrics.totalCollected)}
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 8.2, isPositive: true }}
          color="cyan"
        />
        <MetricCard
          title="Por Cobrar"
          value={formatCurrency(metrics.pendingCollection)}
          icon={<Clock className="h-5 w-5" />}
          subtitle={`${metrics.collectionRate.toFixed(0)}% recaudado`}
          color="amber"
        />
        <MetricCard
          title="Clientes"
          value={metrics.clientsCount.toString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 3, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lot Status Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-emerald-400" />
              </div>
              Estado de Lotes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <DonutChart
              data={lotStatusData}
              size={180}
              strokeWidth={20}
              centerValue={metrics.totalLots.toString()}
              centerLabel="Total"
            />
          </CardContent>
        </Card>

        {/* Monthly Payments Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-cyan-400" />
              </div>
              Recaudo Mensual
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <BarChart
              data={metrics.monthlyPayments}
              height={180}
              barColor="#06b6d4"
              formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Projects & Collection Progress */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-purple-400" />
                </div>
                Proyectos Activos
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">
                  Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => {
                const projectLots = lots.filter((l) => l.projectId === project.id);
                const sold = projectLots.filter((l) => l.status === 'sold').length;
                const reserved = projectLots.filter((l) => l.status === 'reserved').length;
                const available = projectLots.filter((l) => l.status === 'available').length;
                const progress = projectLots.length > 0
                  ? ((sold + reserved) / projectLots.length) * 100
                  : 0;

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                      <Building2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </h3>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {progress.toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{project.location}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-emerald-400">{available} disponibles</span>
                        <span className="text-amber-400">{reserved} apartados</span>
                        <span className="text-purple-400">{sold} vendidos</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </Link>
                );
              })}

              {projects.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No hay proyectos registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collection Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              Meta de Recaudo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4">
            <ProgressRing
              value={metrics.collectionRate}
              max={100}
              size={140}
              strokeWidth={12}
              color="#f59e0b"
            />
            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Recaudado</span>
                <span className="text-emerald-400 font-medium">
                  {formatCurrency(metrics.totalCollected)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Pendiente</span>
                <span className="text-amber-400 font-medium">
                  {formatCurrency(metrics.pendingCollection)}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-white font-bold">
                  {formatCurrency(metrics.totalCollected + metrics.pendingCollection)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-emerald-400" />
                </div>
                Pagos Recientes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/payments">
                  Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.recentPayments.length > 0 ? (
              <div className="space-y-3">
                {metrics.recentPayments.map((payment) => {
                  const lot = lots.find((l) => l.id === payment.lotId);
                  const client = metrics.clients.find((c) => c.id === payment.clientId);

                  return (
                    <div
                      key={payment.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {client?.name || 'Cliente'}
                        </p>
                        <p className="text-sm text-slate-400">
                          Lote {lot?.number} • {formatDateShort(payment.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">
                          +{formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-slate-500">{payment.receiptNumber}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No hay pagos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-cyan-400" />
              </div>
              Resumen del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-emerald-400">Pagos recibidos</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {payments.filter((p) => {
                    const paymentDate = new Date(p.date);
                    const now = new Date();
                    return (
                      paymentDate.getMonth() === now.getMonth() &&
                      paymentDate.getFullYear() === now.getFullYear()
                    );
                  }).length}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-400">Lotes apartados</span>
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-white">{metrics.reservedLots}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-400">Lotes vendidos</span>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{metrics.soldLots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  color: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose';
}

function MetricCard({ title, value, icon, trend, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20',
  };

  const iconColorClasses = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]}`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconColorClasses[color]}`}>
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                trend.isPositive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

// Helper function to get monthly payments data
function getMonthlyPayments(payments: { date: string; amount: number }[]) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const now = new Date();
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthPayments = payments.filter((p) => {
      const paymentDate = new Date(p.date);
      return (
        paymentDate.getMonth() === date.getMonth() &&
        paymentDate.getFullYear() === date.getFullYear()
      );
    });

    result.push({
      label: months[date.getMonth()],
      value: monthPayments.reduce((sum, p) => sum + p.amount, 0),
    });
  }

  return result;
}
