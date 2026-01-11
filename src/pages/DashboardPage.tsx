import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateShort, getLotStatusLabel, getLotStatusColor } from '@/utils/formatters';
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
      <div className="space-y-6 stagger-children">
        {/* Welcome Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Hola, {user.name}</h1>
                <p className="text-muted-foreground">Bienvenido a tu panel de control</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mis Lotes</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{clientLots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">propiedades asignadas</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pagado</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">en pagos acumulados</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pagos Realizados</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{clientPayments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">transacciones completadas</p>
            </CardContent>
          </Card>
        </div>

        {/* My Lots */}
        {clientLots.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
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
                    <div key={lot.id} className="p-4 rounded-xl bg-white/50 border border-border/50 hover:bg-white/80 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">Lote {lot.number}</p>
                          <p className="text-sm text-muted-foreground">{project?.name}</p>
                        </div>
                        <Badge className={getLotStatusColor(lot.status)}>
                          {getLotStatusLabel(lot.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso de pago</span>
                          <span className="font-medium">{formatCurrency(paid)} / {formatCurrency(lot.price)}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full progress-gradient transition-all duration-500 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-right text-muted-foreground">{progress.toFixed(1)}% completado</p>
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
    <div className="space-y-6 stagger-children">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Resumen general del sistema</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-white/50 px-4 py-2 rounded-xl">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Proyectos Activos</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              de {projects.length} totales
              <ArrowUpRight className="h-3 w-3" />
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lotes Vendidos</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{soldLots}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{reservedLots} apartados</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{availableLots} disponibles</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{clients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">clientes registrados</p>
          </CardContent>
        </Card>

        <Card className="hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cobranza</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {formatCurrency(totalSales)} en ventas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
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
                      <span className="font-medium text-foreground">{project.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {sold + reserved}/{total}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${reservedPercentage}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        {sold} vendidos
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
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
                    className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{client?.name || 'Cliente'}</p>
                        <p className="text-xs text-muted-foreground">
                          Lote {lot?.number} - {formatDateShort(payment.date)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(payment.amount)}
                    </span>
                  </div>
                );
              })}

              {recentPayments.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No hay pagos registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* POC Notice */}
      <Card className="border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            Aviso de Demostración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700/80">
            Esta es una POC (Prueba de Concepto). Los datos mostrados son de demostración.
            En producción, aquí se mostrarían alertas de pagos vencidos y notificaciones importantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
