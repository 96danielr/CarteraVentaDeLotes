import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateShort, getLotStatusLabel } from '@/utils/formatters';
import {
  FolderKanban,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
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
      <div className="space-y-6 stagger">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl glass p-6">
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
          <Card className="glass-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Mis Lotes</CardTitle>
              <div className="w-10 h-10 rounded-xl icon-container-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-emerald glow-text">{clientLots.length}</div>
              <p className="text-xs text-slate-500 mt-1">propiedades asignadas</p>
            </CardContent>
          </Card>

          <Card className="glass-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Pagado</CardTitle>
              <div className="w-10 h-10 rounded-xl icon-container-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-gold">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-slate-500 mt-1">en pagos acumulados</p>
            </CardContent>
          </Card>

          <Card className="glass-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pagos Realizados</CardTitle>
              <div className="w-10 h-10 rounded-xl icon-container-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{clientPayments.length}</div>
              <p className="text-xs text-slate-500 mt-1">transacciones completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* My Lots */}
        {clientLots.length > 0 && (
          <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
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
                    <div key={lot.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-white">Lote {lot.number}</p>
                          <p className="text-sm text-slate-400">{project?.name}</p>
                        </div>
                        <Badge className="status-available">
                          {getLotStatusLabel(lot.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progreso de pago</span>
                          <span className="font-medium text-white">{formatCurrency(paid)} / {formatCurrency(lot.price)}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full progress-glow transition-all duration-500 rounded-full"
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
  const clients = getClients();
  const soldLots = lots.filter(l => l.status === 'sold').length;
  const reservedLots = lots.filter(l => l.status === 'reserved').length;
  const availableLots = lots.filter(l => l.status === 'available').length;
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalSales = lots
    .filter(l => l.status === 'sold' || l.status === 'reserved')
    .reduce((sum, l) => sum + l.price, 0);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 stagger">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl glass p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-slate-400">Resumen general del sistema</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 glass px-4 py-2 rounded-xl">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card stat-accent group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">Proyectos</CardTitle>
            <div className="w-10 h-10 rounded-xl icon-container-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="h-5 w-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gradient-emerald">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              de {projects.length} totales
              <ArrowUpRight className="h-3 w-3 text-emerald-500 hidden sm:inline" />
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">Vendidos</CardTitle>
            <div className="w-10 h-10 rounded-xl icon-container-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">{soldLots}</div>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
              <span className="status-reserved text-[10px] sm:text-xs px-2 py-0.5 rounded-full">{reservedLots} apt</span>
              <span className="status-available text-[10px] sm:text-xs px-2 py-0.5 rounded-full">{availableLots} disp</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">Clientes</CardTitle>
            <div className="w-10 h-10 rounded-xl icon-container-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{clients.length}</div>
            <p className="text-xs text-slate-500 mt-1 hidden sm:block">clientes registrados</p>
            <p className="text-xs text-slate-500 mt-1 sm:hidden">registrados</p>
          </CardContent>
        </Card>

        <Card className="glass-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-400">Cobranza</CardTitle>
            <div className="w-10 h-10 rounded-xl icon-container-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gradient-gold">{formatCurrency(totalCollected)}</div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              de {formatCurrency(totalSales)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Project Summary */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg icon-container-primary flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              Progreso por Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {projects.filter(p => p.status === 'active').map(project => {
                const projectLots = lots.filter(l => l.projectId === project.id);
                const sold = projectLots.filter(l => l.status === 'sold').length;
                const reserved = projectLots.filter(l => l.status === 'reserved').length;
                const total = projectLots.length;
                const soldPercentage = total > 0 ? (sold / total) * 100 : 0;
                const reservedPercentage = total > 0 ? (reserved / total) * 100 : 0;

                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{project.name}</span>
                      <span className="text-sm text-slate-400">
                        {sold + reserved}/{total}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                        style={{ width: `${soldPercentage}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${reservedPercentage}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        {sold} vendidos
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {reserved} apartados
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg icon-container-gold flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              Pagos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment, index) => {
                const lot = lots.find(l => l.id === payment.lotId);
                const client = clients.find(c => c.id === payment.clientId);

                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-emerald-500/20"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl icon-container-primary flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{client?.name || 'Cliente'}</p>
                        <p className="text-xs text-slate-500">
                          Lote {lot?.number} - {formatDateShort(payment.date)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-400 glow-text">
                      +{formatCurrency(payment.amount)}
                    </span>
                  </div>
                );
              })}

              {recentPayments.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl icon-container mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500">No hay pagos registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* POC Notice */}
      <Card className="glass border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
        <CardContent className="flex items-start gap-3 pt-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-400">Aviso de Demostración</p>
            <p className="text-sm text-slate-400 mt-1">
              Esta es una POC (Prueba de Concepto). Los datos mostrados son de demostración.
              En producción, aquí se mostrarían alertas de pagos vencidos y notificaciones importantes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
