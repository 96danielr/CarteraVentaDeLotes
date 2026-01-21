import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { CommissionStatus } from '@/types';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  Award,
  Clock,
  CheckCircle,
  Wallet,
  Target,
  Calendar,
  Star,
} from 'lucide-react';

const statusLabels: Record<CommissionStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  paid: 'Pagada',
  cancelled: 'Cancelada',
};

const statusColors: Record<CommissionStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const lotStatusLabels: Record<string, string> = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
};

const lotStatusColors: Record<string, string> = {
  available: 'bg-emerald-500/20 text-emerald-400',
  reserved: 'bg-amber-500/20 text-amber-400',
  sold: 'bg-rose-500/20 text-rose-400',
};

export function MySalesPage() {
  const { user } = useAuth();
  const { projects, users, getLotsBySalesPerson, getCommissionsBySalesPerson } = useData();

  // Ventas del comercial
  const mySales = useMemo(() => {
    if (!user) return [];
    return getLotsBySalesPerson(user.id);
  }, [user, getLotsBySalesPerson]);

  // Comisiones del comercial
  const myCommissions = useMemo(() => {
    if (!user) return [];
    return getCommissionsBySalesPerson(user.id).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [user, getCommissionsBySalesPerson]);

  // Métricas
  const metrics = useMemo(() => {
    const totalSales = mySales.length;
    const soldLots = mySales.filter(l => l.status === 'sold').length;
    const reservedLots = mySales.filter(l => l.status === 'reserved').length;
    const totalSalesAmount = mySales.reduce((sum, l) => sum + l.price, 0);

    const totalCommissions = myCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingCommissions = myCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const approvedCommissions = myCommissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidCommissions = myCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    // Ventas este mes
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const salesThisMonth = mySales.filter(l => {
      if (!l.saleDate) return false;
      return new Date(l.saleDate) >= thisMonth;
    }).length;

    // Promedio de comisión
    const avgCommissionRate = myCommissions.length > 0
      ? myCommissions.reduce((sum, c) => sum + c.commissionRate, 0) / myCommissions.length
      : 0;

    return {
      totalSales,
      soldLots,
      reservedLots,
      totalSalesAmount,
      totalCommissions,
      pendingCommissions,
      approvedCommissions,
      paidCommissions,
      salesThisMonth,
      avgCommissionRate,
    };
  }, [mySales, myCommissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Award className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mis Ventas</h1>
          <p className="text-muted-foreground">Resumen de tu desempeño comercial</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Comisiones</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(metrics.totalCommissions)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Ventas Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalSalesAmount)}</p>
                <p className="text-xs text-slate-500">{metrics.totalSales} lotes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Por Cobrar</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(metrics.pendingCommissions + metrics.approvedCommissions)}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.approvedCommissions > 0 && (
                    <span className="text-cyan-400">{formatCurrency(metrics.approvedCommissions)} aprobadas</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Ventas Este Mes</p>
                <p className="text-2xl font-bold">{metrics.salesThisMonth}</p>
                <p className="text-xs text-slate-500">
                  Tasa promedio: {metrics.avgCommissionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Comisiones */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estado de Comisiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-sm">Pendientes</span>
                </div>
                <span className="font-bold text-amber-400">
                  {formatCurrency(metrics.pendingCommissions)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Aprobadas</span>
                </div>
                <span className="font-bold text-cyan-400">
                  {formatCurrency(metrics.approvedCommissions)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm">Pagadas</span>
                </div>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(metrics.paidCommissions)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Progreso de cobro</span>
                  <span>
                    {metrics.totalCommissions > 0
                      ? ((metrics.paidCommissions / metrics.totalCommissions) * 100).toFixed(0)
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{
                      width: `${metrics.totalCommissions > 0 ? (metrics.paidCommissions / metrics.totalCommissions) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de Lotes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mis Lotes Vendidos/Reservados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {mySales.slice(0, 6).map(lot => {
                const project = projects.find(p => p.id === lot.projectId);
                const client = users.find(u => u.id === lot.clientId);
                return (
                  <div
                    key={lot.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">Lote {lot.number}</p>
                        <p className="text-xs text-slate-400">{project?.name}</p>
                      </div>
                      <Badge className={lotStatusColors[lot.status]}>
                        {lotStatusLabels[lot.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        <Users className="h-3 w-3 inline mr-1" />
                        {client?.name || 'N/A'}
                      </span>
                      <span className="font-medium text-emerald-400">
                        {formatCurrency(lot.price)}
                      </span>
                    </div>
                    {lot.saleDate && (
                      <p className="text-xs text-slate-500 mt-2">
                        Vendido: {formatDateShort(lot.saleDate)}
                      </p>
                    )}
                  </div>
                );
              })}
              {mySales.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aún no tienes ventas registradas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Comisiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Historial de Comisiones
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Venta</TableHead>
                  <TableHead className="text-right">Tasa</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCommissions.map(commission => (
                  <TableRow key={commission.id}>
                    <TableCell className="text-slate-400">
                      {formatDateShort(commission.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">{commission.lotNumber}</TableCell>
                    <TableCell className="text-slate-400">{commission.projectName}</TableCell>
                    <TableCell>{commission.clientName}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(commission.saleAmount)}
                    </TableCell>
                    <TableCell className="text-right text-slate-400">
                      {commission.commissionRate}%
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-400">
                      {formatCurrency(commission.commissionAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[commission.status]}>
                        {statusLabels[commission.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {myCommissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                      No tienes comisiones registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
